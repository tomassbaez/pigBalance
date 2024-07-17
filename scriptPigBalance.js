//Traemos los componentes del archivo html Formulario/ inputs y lista de transacción
const  transactionForm = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('descripcion');
const amountInput = document.getElementById('amount');
const transactionList = document.getElementById('transaction-list');
const balanceElement = document.getElementById('balance');

//cargamos los datos (transacciones) alamacenadas en el local storage al cargar la pagina web
document.addEventListener('DOMContentLoaded', loadTransactions);

//Event listener para manejar el evento de envio en el formulario
transactionForm.addEventListener('submit', function(event) {
    event.preventDefault();

    //obtenemos los valores de los input y creamos una nueva transaccion
    const descripcion = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());
    if (descripcion !== '' && !isNaN(amount)) { //si descricion no esta vacio y amount contiene un valor numero crea la transaccion
        addTransaction({descripcion, amount});
        descriptionInput.value = '';
        amountInput.value = '';
    }
});

//Funcion para añadir una nueva transaccion
function addTransaction(transaction) {
    const li = document.createElement('li'); //creamos el elemento lista
    li.textContent = `${transaction.descripcion}: $${transaction.amount.toFixed(0)}`; //añadimos datos al elemento li

    const deleteButton = document.createElement('button'); //creamos un boton eliminar por cada li creada
    deleteButton.textContent = 'Eliminar';
    deleteButton.addEventListener('click', function(){
        transactionList.removeChild(li); //eliminamos la transaccion de la lista
        removeTransactionFromLocalStorage(transaction);
        updateBalance();
    });

    li.appendChild(deleteButton); //añadimos el boton eliminar al elemento de transaccion creado
    transactionList.appendChild(li); //Añadimos el elemnto transaccion a la lista

    saveTransactionToLocalStorage(transaction);
    updateBalance();
}

//Funcion para cargar las transacciones del local storage
function loadTransactions() {
    const transactions = getTransactionsFromLocalStorage();
    transactions.forEach(transaction => addTransaction(transaction));
}

//Funcion para obtener los elementos de transaccion del LS
function getTransactionsFromLocalStorage() {
    let transactions;
    if (localStorage.getItem('transactions') === null) {
        transactions = [];
    } else {
        transactions = JSON.parse(localStorage.getItem('transactions'));
    }
    return transactions;
}

//Funcion para guardar una transaccion en el local storage
function saveTransactionToLocalStorage(transaction) {
    const transactions = getTransactionsFromLocalStorage();
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

//Funcion para remover un elemento de transaccion del Local Storage
function removeTransactionFromLocalStorage(transactionToRemove) {
    let transactions = getTransactionsFromLocalStorage();
    transactions = transactions.filter(transaction => transaction.descripcion !== transactionToRemove.descripcion || transaction.amount !== transactionToRemove.amount);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

//Funcion para actualizar el balance total
function updateBalance() {
    const transactions = getTransactionsFromLocalStorage();
    const total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0)
    balanceElement.textContent = total;
}



