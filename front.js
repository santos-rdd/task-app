/*------------------------------ Front-End ------------------------------*/
// const getUsers = await fetch('http://localhost:4000/');

const root = document.getElementById("root");
const taskContainer = document.getElementById('task-list'); 
const modalTask = document.getElementById('modalTask'); 
const backImg = document.getElementById('back-img-id'); 
const close = document.getElementById('close'); 
const noticeError = document.getElementById('notice'); 
const registerTaskButton = document.getElementById('registerTaskButton'); 
const modalResponse = document.getElementById('modalResponse'); 
const closeResponse = document.getElementById('closeResponse'); 
const idCardCurrent = document.getElementById('idCardCurrent');
const responseButton = document.getElementById('responseButton');
const h2Confirm = document.getElementById('h2Confirm');
const iconTaskTheme = document.getElementById('icon-task-theme');
const themeTitle = document.getElementById('themeTitle');

const modalTaskPut = document.getElementById('modalTaskPut');
const closePut = document.getElementById('closePut');
const infoTaskPut = document.getElementById('infoTaskPut');
const namePut = document.getElementById('namePut');
const descTaskPut = document.getElementById('descTaskPut');
const registerTaskButtonPut = document.getElementById('registerTaskButtonPut');
const noticePut = document.getElementById('noticePut');
const headerFetch = { "Content-Type" : "application/json" }
const writeImage = './assets/write.png';

// Valores de input 
const inputValueName = document.getElementById('name');
const inputValueDescription = document.getElementById('descTask');

// Valores de let que vão ser atribuidos depois 🔥🔥
let currentId = null;
let colorMsg = null;
let message = null;

// Funções reutilizaveis
function verificateInputValues(inputArgName, inputArgDesc){
    const inputName = inputArgName.trim();
    const inputDescription = inputArgDesc.trim();

    let error = '';

        if(!inputName || !inputDescription){
            return 'Não podes mandar campo vazio!';
        }

        if(!isNaN(inputName)){
            return 'Nome não pode ser numérico!';
        }

        if(!isNaN(Number(inputDescription)) || inputDescription == 0){ 
            return error = 'Não podes mandar valores que não sejam string!';  
        };

        if(inputName.length <= 3 || inputName.length >= 40){
            return error = 'Não podes ter um nome com mais de 40 ou menos de 3 caracteres!'; 
        }

        if(inputDescription.length <= 3 || inputDescription.length >= 100){
            return error = 'Não podes ter uma descrição com mais de 100 ou menos de 3 caracteres!'; 
        }

        if(!inputName || !inputDescription){
            return error = 'Não podes mandar campo vazio!'; 
        }
        return true;
}

function randomTag(){
    let random = Math.ceil(Math.random() * 3);
    const randomTagsObject = [
        '',
        './assets/tag.jpg',
        './assets/code_tag.jpg',
        './assets/imgTag.jpg'
    ];
    
    let specialRandom = Math.ceil(Math.random() * 100);
    if(specialRandom == 21){
        console.log('Voce encontrou a imagem lendaria 🥶🥶');
        return './assets/frierenRandomEspecial.jpg';
    }
    return randomTagsObject[random];
}

async function createCard(){
    taskContainer.innerHTML = "";
    const usersArray = await getUsersUpdated();
    if(!Array.isArray(usersArray)){
        console.error('Erro ao carregar dados');
        return;
    }
    for(let x = 0; x < usersArray.length; x++){
        // Criando divs (N aguento mais)
        let taskCard = document.createElement('div');
        let taskIcons = document.createElement('div');
        let taskInfo = document.createElement('div');
        let taskTitle = document.createElement('div');
        let taskDesk = document.createElement('div');
        let taskButton = document.createElement('div');
        
        // Criando outros elementos 
        let imageElement = document.createElement('img');
        let buttonConfirmTask = document.createElement('button');
        let buttonRefuseTask = document.createElement('button');

        // Adicionando a classe a eles
        taskCard.classList.add('task-card');
        taskIcons.classList.add('task-icon');
        taskInfo.classList.add('task-info');
        taskTitle.classList.add('task-title');
        taskDesk.classList.add('task-desc');
        taskButton.classList.add('buttons-task')
        imageElement.classList.add('task');
        buttonConfirmTask.classList.add('task-button');
        buttonConfirmTask.classList.add('confirm-task');
        buttonRefuseTask.classList.add('task-button');
        buttonRefuseTask.classList.add('refuse-task');

        // Criando ligações
        taskCard.appendChild(taskIcons);
        taskCard.appendChild(taskInfo);

        taskIcons.appendChild(imageElement);

        taskInfo.appendChild(taskTitle);
        taskInfo.appendChild(taskDesk);
        taskInfo.appendChild(taskButton);

        taskButton.appendChild(buttonConfirmTask);
        taskButton.appendChild(buttonRefuseTask);

        // Imagem de reescrever informações kksk
        let imageWrite = document.createElement('img');
        imageWrite.src = writeImage;
        imageWrite.classList.add('imageWrite');
        taskIcons.appendChild(imageWrite);

        // Adicionado Informações a eles;
        buttonConfirmTask.textContent = 'Confirmar';
        buttonRefuseTask.textContent = 'Abandonar';
        imageElement.src = randomTag();

        // Criando um card para cada valor do banco de dados
        taskContainer.appendChild(taskCard);
        taskTitle.textContent = usersArray[x].nome;
        taskDesk.textContent = usersArray[x].descricao;

        buttonRefuseTask.addEventListener('click', ()=>{
            responseButton.style.background = 'red';
            idCardCurrent.innerHTML = `Tem certeza que deseja <span class='responseTitleGiveUp'>DESISTIR</span> da tarefa <span class='responseTitleGiveUp'>"${ usersArray[x].nome }"</span>`;
            responseButton.textContent = 'Desistir';
            modalResponse.style.display = 'flex';
            currentId = usersArray[x].id;
            colorMsg = 'red';
            message = 'Tarefa deletada!';
        });
        
        buttonConfirmTask.addEventListener('click', ()=>{
            modalResponse.style.display = 'flex';
            responseButton.style.background = '#237386';
            idCardCurrent.innerHTML = `Você <span class='responseTitle'>COMPLETOU</span> a tarefa<br><span class='responseTitle'>"${ usersArray[x].nome }"</span>?`;
            responseButton.textContent = 'Completar';
            currentId = usersArray[x].id;
            message = 'Tarefa concluida!';
        });

        taskIcons.addEventListener('click', ()=>{
            modalTaskPut.style.display = 'flex';
            currentId = usersArray[x].id;
        })

    }

}

// Pegando usuarios do back
async function getUsersUpdated(){
    try{
        const users = await fetch('http://localhost:4000/');
        const usersArray = await users.json();
        return usersArray;
    } catch (err) {
        console.error(err);
        return [];
    }
}

// Conexão com servidor 
async function postTask(nameTask, descTask){
    try{
        const resultPostTask = await fetch('http://localhost:4000/', {
            method: 'POST',
            headers: headerFetch,
            body: JSON.stringify({ nome: nameTask, descricao: descTask })
        });
        const resultPostTaskParser = await resultPostTask.json();

        return resultPostTaskParser;
    } catch (err) {
        return err;
    }

} 

async function deleteCard(currentId){
    try{
        console.log('inicio delete');
        const deleteResponse = await fetch('http://localhost:4000/',{
            method: 'DELETE',
            headers: headerFetch,
            body: JSON.stringify({ id: currentId })
        });
        
        const returnResponse = await deleteResponse.json();
        console.log('final delete');
        return returnResponse;
    } catch (err) {
        return err;
    }
}

async function updateCard(name, description, currentId){
    try{
        const result = await fetch('http://localhost:4000/', {
            method: 'PUT',
            headers: headerFetch,
            body: JSON.stringify({ nome: name, descricao: description, id: currentId })
        });
        
        const resultPut = await  result.json();
        return resultPut;
    } catch (err) {
        return err;
    }
}

// Eventos de elementos
backImg.addEventListener('click', ()=>{
    modalTask.style.display = 'flex';
})

close.addEventListener('click', ()=>{
    modalTask.style.display = 'none'
})

registerTaskButton.addEventListener('click', async ()=>{
    const valueName = inputValueName.value;
    const valueDescription = inputValueDescription.value;
    const resultVerified = verificateInputValues(valueName, valueDescription);

    if(resultVerified !== true){
        noticeError.classList.add('show');
        noticeError.textContent = resultVerified;
        setTimeout(()=>{
            noticeError.classList.remove('show');
        }, 3000);

        setTimeout(()=>{
            noticeError.textContent = "";
        }, 3300);
        return;
    }

    const resultPostFront = await postTask(inputValueName.value, inputValueDescription.value);
    if(resultPostFront.result === false){
        noticeError.classList.add('show');
        noticeError.textContent = 'Erro: ' + resultPostFront.mensagem;

        setTimeout(()=>{
            noticeError.classList.remove('show');
        }, 3000);

        setTimeout(()=>{
            noticeError.textContent = "";
        }, 3300);
        return;
    }

    if(resultPostFront.result === true){
        createCard();
        noticeError.classList.add('show');        
        inputValueName.value = '';
        inputValueDescription.value = '';
            
        noticeError.textContent = resultPostFront.mensagem;

        setTimeout(()=>{
            noticeError.classList.remove('show');        
        }, 3200);
    }
});

closeResponse.addEventListener('click', ()=>{
    modalResponse.style.display = 'none';
})


closePut.addEventListener('click', ()=>{
        modalTaskPut.style.display = 'none';
});
    
registerTaskButtonPut.addEventListener('click', async ()=>{
        const newName = namePut.value;
        const newDesc = descTaskPut.value;
        const resultVerifiedPut = verificateInputValues(newName, newDesc);
        if(resultVerifiedPut !== true){
            noticePut.classList.add('show');
            noticePut.textContent = resultVerifiedPut;
            setTimeout(()=>{
                noticePut.classList.remove('show');
            }, 3000);
            
            setTimeout(()=>{
                noticePut.textContent = "";
            }, 3300);
            return;
        }
        try{
            const resultPut = await updateCard(newName, newDesc, currentId);
            
            if(resultPut.result === true){
                noticePut.classList.add('show');
                noticePut.textContent = resultPut.mensagem;
                setTimeout(()=>{
                    noticePut.classList.remove('show');
                    noticePut.textContent = "";
                }, 3000);
                
                setTimeout(()=>{
                    modalTaskPut.style.display = 'none';
                }, 3300);
                namePut.value = '';
                descTaskPut.value = '';
                createCard();
                    
                setTimeout(()=>{
                    noticePut.classList.remove('show');
                }, 2000);
            return;
            }
                noticePut.classList.add('show');
                noticePut.textContent = resultPut.mensagem;
                setTimeout(()=>{
                    noticePut.classList.remove('show');
                    noticePut.textContent = "";
            }, 3000);
            } catch (err) {
                console.error(err);
            }
});
    
responseButton.addEventListener("click", async ()=>{
        let responseDelete = await deleteCard(currentId);
            if(responseDelete.result == true){
                createCard();
                modalResponse.style.display = 'none';
                h2Confirm.style.color = colorMsg;
                h2Confirm.textContent = message;
                h2Confirm.classList.add('show');
                setTimeout(()=>{
                    h2Confirm.classList.remove('show');
                }, 1500);
                
                setTimeout(()=>{
                    h2Confirm.textContent = "";
                }, 2000);
                return;
            }
});

let darkMode = true;

iconTaskTheme.addEventListener('click', ()=>{ 
    if(!darkMode){
        root.style.background = 'white';
        themeTitle.style.color = 'black';
        darkMode = true;
    } else {
        root.style.background = '#b8d3dc';
        themeTitle.style.color = 'white';
        themeTitle.style.fontWeight = 'bold';
        darkMode = false;
    }
});

createCard();
