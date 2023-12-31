// Book Class : Represents a book
class Book{
    constructor(title,author,isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
// UI Class : Handles UI task
class UI{
    static displayBooks(){
        /*const storedBooks = [
        {
            title:  'Book One',
            author: 'John Doe',
            isbn: '344344',
        },

        {
            title:  'Book Two',
            author: 'Jane Doe',
            isbn: '454454',
        }
    ];

    const books = storedBooks;
    */
   const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book){
    const list = document.querySelector('#book-list');

    const row = document.createElement('tr');

    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="btn btn-danger btn-sm
     delete">X</a></td> 
    `;
    // btn-danger gives red color to button and btn-sm makes button small delete is class and X is text
  
    list.appendChild(row);
  }

  static deleteBook(el){
    if(el.classList.contains('delete')){
        el.parentElement.parentElement.remove();
    }
  }


  static showAlert(message, className){
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);
    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields(){
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }
}

// Store Class : Handles storage

class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }
        else{
            books = JSON.parse(localStorage.getItem('books')); // JSON.parse is used to use it as regular array of objects else it will be stored as string
        }

        return books;
    }

    static addBook(book){
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1); //splice is used to remove and 1 is to remove just 1 book
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event : display books
document.addEventListener('DOMContentLoaded', UI.displayBooks); // as soon as the content is loaded ui.displayBooks fucntion gets called

// Event : Add a book


document.querySelector('#book-form').addEventListener('submit', (e)=> {

    // Prevent actual submit
    e.preventDefault();

    // get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate
    if(title === '' || author === '' || isbn == ''){
        UI.showAlert('Please fill in all fields', 'danger'); // if we put  success in palce of danger we will get green color and info will give blue color
    }
    else{
        
        // Instantiate book
        const book = new Book(title, author, isbn);

        console.log(book);

        // Add book to UI
        UI.addBookToList(book);

        // Add book to store
        Store.addBook(book);

        // Show success message
        UI.showAlert('Book Added', 'success');

        // Clear fields
        UI.clearFields();
    }

    
});

// Event : Remove a book

document.querySelector('#book-list').addEventListener('click', (e) => {

    // Remove book from UI
    UI.deleteBook(e.target);

    // Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent); // will give us isbn

    UI.showAlert('Book Removed', 'success');
});