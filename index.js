/*------------------------------ Model ------------------------------*/
// Conexão com Banco de dados
import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
    user: 'aprendendo9',
    password: '2132',
    host: 'localhost',
    database: 'pratica9'
});

// Create server 
/*------------------------------ Back-End ------------------------------*/
// Server que faz conexão com o banco de dados
import { createServer, get } from 'node:http';
const port = 3000;
const host = '127.0.0.1';

async function postUsers(receiveObject){
    let errorCreateUser = { mensagem: 'Erro inesperado ao criar usuario!', result: false };
    let sucessToCreateUser = { mensagem: 'Tarefa criada com sucesso!', result: true };
    try{
        const objectReceiveTreated = JSON.parse(receiveObject);
        const [ resultPost ] = await db.query('insert into cadastro(nome, descricao) values(?,?)', [ objectReceiveTreated.nome, objectReceiveTreated.descricao ]);
        if(resultPost.affectedRows > 0){ return sucessToCreateUser; }
        return errorCreateUser;
    } catch {
        return errorCreateUser;
    }
} 

async function deleteUsers(idDeleteString){
    const errorCreateUser = { mensagem: 'Erro inesperado ao deleter tarefa!', result: false };
    const sucessToCreateUser = { mensagem: 'Tarefa deletada!', result: true }; 
    try{
        const idDelete = JSON.parse(idDeleteString);
        const [deleteQuery] = await db.query('delete from cadastro where id = ?', [idDelete.id]);
        if( deleteQuery.affectedRows > 0 ) { return sucessToCreateUser };
        return errorCreateUser;
    } catch {
        return errorCreateUser;
    }
}

async function putUsers(putObject){
    let errorPutUser = { mensagem: 'Erro inesperado ao atualizar tarefa!', result: false };
    let sucessToPutUser = { mensagem: 'Tarefa atualizada com sucesso!', result: true }
    try{
        const putModel = JSON.parse(putObject);
        const [resultPut] = await db.query('update cadastro set nome = ?, descricao = ? where id = ?',[ putModel.nome ,putModel.descricao ,putModel.id  ]);
        if(resultPut.affectedRows > 0){
            return sucessToPutUser
        }
        return errorPutUser;
    } catch (err) {
        console.error(err);
        return errorPutUser; 
    }
}

const server = createServer( async (req, res)=>{
    const path = req.url;
    const httpMethod = req.method;
    let errorCreateUser = { mensagem: 'Erro ao completar tarefa!', result: false };
    let sucessToCreateUser = { mensagem: 'Tarefa realizada com sucesso!', result: true }
    res.setHeader("Content-Type", "application/json");

    if(path === '/' && httpMethod === 'POST'){
        try{
            let body = '';
            req.on('data', chunk =>{
                body += chunk
            });

            req.on('end', async ()=>{
                const result = await postUsers(body);
                return res.end(JSON.stringify(result));
            })
            
        } catch {
            const resultError = { mensagem: 'Erro ao cadastrar informações no banco de dados!', result: false }; 
            return res.end(JSON.stringify(resultError));
        }
    }

    if(path === "/" && httpMethod === 'DELETE'){
        try{
            let body = '';
            req.on('data', chunk =>{
                body += chunk;
            })

            req.on('end', async ()=>{
                const resultBody = await deleteUsers(body);
                return res.end(JSON.stringify(resultBody));
            })
        } catch {
            return res.end(JSON.stringify(errorCreateUser));;
        }
    }

    if(path === '/' && httpMethod === 'PUT'){
        let body = '';
        req.on('data', chunk => {
            body += chunk
        });
        
        req.on('end', async ()=>{
            try{
                const resultPut = await putUsers(body);
                if(resultPut.result === true){
                    return res.end(JSON.stringify(sucessToCreateUser));
                }
                return res.end(JSON.stringify(errorCreateUser));
            } catch (err) {
                console.error(err);
                return res.end(JSON.stringify(errorCreateUser));
            }
            });
    }
})

server.listen(port, host, ()=>{
    console.log('Servidor a todo vapor🔥❤️');
});


/*------------------------------ Server Validation ------------------------------*/
// Server que faz validação
const portValidationServer = 4000;
const hostValidation = '0.0.0.0';
const headerFetch = { "Content-Type" : "application/json" };
const errorMethods = { mensagem: 'Erro na validação do formulario!', result: false };

async function getUsers (){
    const returnError = { mensagem: 'Erro ao validar dados!', result: false };
    try{
        const [users] = await db.query('select * from cadastro');
        return users;
    } catch {
        return returnError;
    }
}

async function postVerifiedDate(body){
    const returnError = { mensagem: 'Erro ao validar dados!', result: false };
    
    try{
    const dateParser = JSON.parse(body);

    
    if( typeof dateParser === 'object'){
        
        if(dateParser.nome.length <= 3 || dateParser.nome.length >= 40){
            return returnError
        }
        
        if(dateParser.descricao.length <= 3 || dateParser.descricao.length >= 100){
            return returnError
        }
        
        const [ sameNameModel ] = await db.query('select * from cadastro where descricao = ? or nome = ?', [ dateParser.descricao, dateParser.nome ]);
    
        if(sameNameModel.length > 0){
            return returnError;
        }

        dateParser.nome = dateParser.nome.trim();
        dateParser.descricao = dateParser.descricao.trim();
        
        if(!dateParser.nome || !dateParser.descricao){
            return returnError;
            }
        return dateParser;
    }

    return returnError;
    } catch {
        return returnError;
    }
}

async function deleteVerificate(body){
    if(!body || typeof body !== 'object'){
        return returnError; 
    }

    const numberId = Number(body.id);
    const usersArray = await getUsers();
    const returnError = { mensagem: 'Erro ao validar dados!', result: false };
    
    if(numberId === undefined || numberId === null){
        return returnError;
    }
    
    if(isNaN(numberId)){
        return returnError;
    }
    
    if(numberId < 0){
        return returnError;
    }
    
    const idExist = usersArray.some( userIdCurrent => userIdCurrent.id === numberId );
    if(!idExist){
        return returnError;
    }

    return true;
}

async function putVerified(body) {
     const returnError = { mensagem: 'Erro ao validar dados!', result: false };
    
    try{
    const dateParser = JSON.parse(body);

    if(!dateParser.id){
        return returnError;
    }
    
    if(typeof dateParser !== 'object' || !dateParser){
        return returnError;
    }

    if(!dateParser.nome || !dateParser.descricao){
        return returnError;
    }

    if(typeof dateParser.nome !== 'string' || typeof dateParser.descricao !== 'string'){
        return returnError;
    }

    const [ sameNameModel ] = await db.query('select * from cadastro where id = ?', [ dateParser.id ]);

    if(sameNameModel.length === 0){
        return returnError;
    }

    dateParser.nome = dateParser.nome.trim();
    dateParser.descricao = dateParser.descricao.trim();

    if(dateParser.nome.length <= 3 || dateParser.nome.length >= 40){
        return returnError
    }

    if(dateParser.descricao.length <= 3 || dateParser.descricao.length >= 100){
        return returnError
    }

    if(!dateParser.nome || !dateParser.descricao){
        return returnError;
    }

    return dateParser;

    } catch (err){
        console.log(err);
        return returnError;
    }
}

const serverValidation = createServer( async (req, res) =>{
    const path = req.url;
    const httpMethod = req.method;
    const returnError = { mensagem: 'Erro ao validar dados!', result: false };
    res.setHeader("Content-Type","application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    try{
        if(req.method === "OPTIONS"){
            res.writeHead(204);
            res.end();
            return;
        }
        
        if(path === '/' && httpMethod === 'GET'){
            try{
                const usuarios = await getUsers();
                return res.end(JSON.stringify(usuarios));
            } catch(err) {
                return res.end(JSON.stringify(err));
            }
        }

        if(path === '/' && httpMethod === 'POST'){
            try{
                let body = '';
                req.on('data', chunk =>{
                    body += chunk
                });

                req.on('end', async ()=>{
                    const verifiedDate = await postVerifiedDate(body);
                    if(verifiedDate.result == false){ return res.end(JSON.stringify(verifiedDate))};

                    const resultFetchToApi = await fetch('http://localhost:3000/', {
                        method: "POST",
                        headers: headerFetch,
                        body: JSON.stringify(verifiedDate)
                    });

                    const objectResult = await resultFetchToApi.json();
                    return res.end(JSON.stringify(objectResult));
                });
            } catch {
                const resultError = { mensagem: 'Erro no POST', result: false }; 
                return res.end(JSON.stringify(resultError));
            }
        }

        if(path === '/' && httpMethod === 'DELETE'){
            let body = '';
            req.on('data', chunk =>{
                body += chunk;
            });
            
            req.on('end', async()=>{
                const parsed = JSON.parse(body);
                const resultVerifiedDelete = await deleteVerificate(parsed);

                if(resultVerifiedDelete == true){
                    fetch('http://localhost:3000/',{
                        method: "DELETE",
                        headers: headerFetch,
                        body: JSON.stringify(parsed)
                    })
                    .then(result => result.json())
                    .then(jsonResult => res.end(JSON.stringify(jsonResult)))
                    .catch(err => res.end(JSON.stringify(err)));

                    return 
                }
                return res.end(JSON.stringify(returnError));
            })
        }

        if(path === '/' && httpMethod === 'PUT'){
            let body = '';
            req.on('data', chunk =>{
                body += chunk;
            })

            req.on('end', async ()=>{
                try{
                    const resultPut = await putVerified(body);
                    if(resultPut.result === false){
                        return res.end(JSON.stringify(errorMethods));
                    }

                    const result = await fetch('http://localhost:3000/', {
                        method: 'PUT',
                        headers: headerFetch,
                        body: JSON.stringify(resultPut)
                    });

                    const resultServer = await result.json();
                    return res.end(JSON.stringify(resultServer));
                } catch (err){
                    console.error(err);
                    return res.end(JSON.stringify(returnError));
                }
            })
        }
    } catch (err){
        return err;
    }
});

serverValidation.listen(portValidationServer, hostValidation, ()=>{
    console.log('Server de validação On 😼❤️');
});
