/* Useful Features */

const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

const randomId = () => self.crypto.randomUUID()

const getData = (key) => JSON.parse(localStorage.getItem(key));
const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const hiddenElement = (selectors) => {
    for (const selector of selectors) {
        $(selector).classList.add("hidden")
    }
}

const cleanContainer = (selector) => $(selector).innerHTML = ""
/* Nav events */
$("#balance-btn-nav").addEventListener('click', () => {
    $("#balances-section").classList.remove('hidden');
    hiddenElement(["#new-operations-section", "#category-section", "#reports-section", "#category-edit-section"])
});


$("#category-btn-nav").addEventListener('click', () => {
    $("#category-section").classList.remove('hidden');
    hiddenElement(["#balances-section", "#new-operations-section", "#reports-section", "#category-edit-section"])
});

$("#reports-btn-nav").addEventListener('click', () => {
    $("#reports-section").classList.remove('hidden');
    hiddenElement(["#category-section", "#balances-section", "#new-operations-section", "#category-edit-section"])
});


$("#new-operation-btn").addEventListener('click', () => {
    $("#new-operations-section").classList.remove('hidden');
    hiddenElement(["#reports-section", "#category-section", "#balances-section", "#category-edit-section"]);
})

//                                                          CATEGORIAS
const categoriesListDefault = [
    {
        categoryName: 'Comidas',
        id: randomId(),
    },
    {
        categoryName: 'Servicios',
        id: randomId(),
    },
    {
        categoryName: 'Salidas',
        id: randomId(),
    },
    {
        categoryName: 'Educación',
        id: randomId(),
    },
    {
        categoryName: 'Transporte',
        id: randomId(),
    },
    {
        categoryName: 'Trabajo',
        id: randomId(),
    }
];

const categories = getData("categoriesLS") || categoriesListDefault

const categoriesList = (categories) => {
    cleanContainer("#categories-list")
    for (const category of categories) {
        //    let nameOfCategory = category.categoryName;
        //    let idOfCategory = category.id;
        $("#categories-list").innerHTML += `
        <div class="flex justify-between">
          <li class="m-2 p-0.5 bg-emerald-100">${category.categoryName}</li>
          <div class="flex ">
            <button type="button" class="m-2 text-sky-700 mx-1 w-win" edit-categories onclick="viewEditCategory('${category.id}')">Editar</button>
            <button type="button" class="m-2 text-sky-700 mx-1 w-win delete-categories" onclick="deleteCategory('${category.id}')">Eliminar</button>
          </div>
        </div>
        `
    }
}
categoriesList(categories)


//delete category
const deleteCategory = (categoryId) => {
    for (let i = 0; i < $$('.delete-categories').length; i++) {
        $$('.delete-categories')[i].onclick = () => {
            const croppedId = $$('.delete-categories')[i].id.slice(20)
            numberId = Number(croppedId)
            const filteredCategories = categories.filter(category => category.id != categoryId)
            setData('categoriesLS', filteredCategories);
            categoriesList(categories)
            deleteCategory(categoryId)
            window.location.reload("#categories-list")
        }
    }
}

//add category 
const saveNewCategory = () => {
    return {
        categoryName: $("#input-add-category").value,
        id: randomId(),
    }
}
setData('categoriesLS', saveNewCategory())

//edit category
// const viewEditCategory = (idOfCategory) => {
//     hiddenElement(["#new-operations-section", "#reports-section", "#category-section", "#balances-section"])
//     $("#category-edit-section").classList.remove('hidden')
//     $("#edit-btn-category").setAttribute("category-selected-id", idOfCategory);
//      $("#input-edit-category").value = categoryToEdit.categoryName
//     const categoryToEdit = getData("categoriesLS").find(category => {
//         if(category.id === idOfCategory){
//             return saveNewCategory(idOfCategory)
//         }
//         return category
//     })
//     setData("categoriesLS", categoryToEdit)
// }


// const confirmEditCategory = (idOfCategory) => {
//     for (let i = 0; i < $$('.edit-categories').length; i++) {
//         $$('.edit-categories')[i].onclick = () => {
//             if (getData("categoriesLS").find(category => category.id === idOfCategory)){
//                 categoryToEdit = category.categoryName = $("#input-edit-category").value}
//             setData('categoriesLS', categoryToEdit)
//             categoriesList(categories)
//             confirmEditCategory(idOfCategory)
//             window.location.reload() 
//         } 
//     }
// }

$("#boton-cancelar-editar-categoria").onclick = () => {
    hiddenElement(["#category-edit-section", "#new-operations-section", "#reports-section", "#balances-section"])
    $("#category-section").classList.remove('hidden')
}

//INICIALIZE FUNCTION
const initializeApp = () => {
    setData('categoriesLS', categories);
    categoriesList(categories);

    $("#add-btn-category").addEventListener("click", (e) => {
        e.preventDefault()
        const updateCategories = getData('categoriesLS')
        updateCategories.push(saveNewCategory())
        setData('categoriesLS', updateCategories)
        categoriesList(categories)
        window.location.reload()
    })

    // $("#edit-btn-category").addEventListener("click", (e) => {
    //     e.preventDefault()
    //     confirmEditCategory()

    //     // const categoryId = $("#edit-btn-category").getAttribute("category-selected-id")
    // })

}
window.addEventListener("load", initializeApp)