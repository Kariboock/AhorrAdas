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

/* CATEGORIAS */
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
    cleanContainer("#categories-option-filters")
    cleanContainer("#categories-option-operations")
    if (Array.isArray(categories) && categories !== undefined && categories !== null) {
        for (const category of categories) {
            $("#categories-list").innerHTML += `
            <div class="flex justify-between">
                <li class="m-2 p-0.5 bg-emerald-100">${category.categoryName}</li>
                <div class="flex ">
                <button type="button" class="m-2 text-sky-700 mx-1 w-win edit-categories" onclick="viewEditCategory('${category.id}')">Editar</button>
                <button type="button" class="m-2 text-sky-700 mx-1 w-win delete-categories" onclick="deleteCategory('${category.id}')">Eliminar</button>
                </div>
            </div>
            `
            $("#categories-option-filters").innerHTML += `<option value="${category.categoryName}">${category.categoryName}</option>`
            $("#categories-option-operations").innerHTML += `<option value="${category.categoryName}">${category.categoryName}</option>`
        }
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
            window.location.reload(["#categories-list", "#categories-option-filters", "#categories-option-operations"])
        }
    }
}
//deleteCategory(category)


// //edit category
const viewEditCategory = (idOfCategory) => {
    hiddenElement(["#new-operations-section", "#reports-section", "#category-section", "#balances-section"])
    $("#category-edit-section").classList.remove('hidden')

    const categoryToEdit = getData("categoriesLS").find(category => category.id === idOfCategory);
    $("#input-edit-category").value = categoryToEdit.categoryName;
    $("#edit-btn-category").setAttribute("category-selected-id", idOfCategory);
}

const confirmEditCategory = () => {
    const idOfCategory = $("#edit-btn-category").getAttribute("category-selected-id");
    const updatedCategories = getData("categoriesLS").map(category => {
        if (category.id === idOfCategory) {
            category.categoryName = $("#input-edit-category").value;
        }
        return category;
    });

    setData('categoriesLS', updatedCategories);
    categoriesList(updatedCategories);
}

//add category 
const saveNewCategory = () => {
    return {
        categoryName: $("#input-add-category").value,
        id: randomId(),
    }
}
setData('categoriesLS', saveNewCategory())

const saveNewEditedCategory = () => {
    return {
        categoryName: $("#input-edit-category").value,
        id: randomId(),
    }
}
setData('categoriesLS', saveNewEditedCategory())

$("#boton-cancelar-editar-categoria").onclick = () => {
    hiddenElement(["#category-edit-section", "#new-operations-section", "#reports-section", "#balances-section"]);
    $("#category-section").classList.remove('hidden')
}

/* FILTROS */
$("#hide-filters").addEventListener("click", () => {
    hiddenElement(["#container-filters", "#hide-filters"]);
    $("#show-filters").classList.remove('hidden')
})

$("#show-filters").addEventListener("click", () => {
    $("#show-filters").classList.add('hidden')
    $("#container-filters").classList.remove('hidden');
    $("#hide-filters").classList.remove('hidden')
})



// Funciones Kari

// OPERATIONS

const operations = getData("operationsLS") || []

// RENDERS
const renderNewOperations = (operationsLS) => {
    for (const operation of operationsLS) {
        $("#table").innerHTML += `
        <tr>
        <td>${operation.Descripcion}</td>
        <td>${operation.Categoria}</td>
        <td>${operation.Fecha}</td>
        <td>${operation.Monto}</td>
        <td>
        <button>Editar</button>
        <button>Eliminar</button>        
        </td>          
        </tr>  
        `
    }
}

const saveNewOperation = () => {
    return {
        id:randomId(),
        Descripcion: $("#description").value,
        Categoria:$("#categories-option-operations").value,
        Fecha:$("#date").value,
        Monto:$("#amount").value
    }
}
   
$("#addNewOperation").addEventListener("click",() => {
    hiddenElement(["#new-operations-section", "#no-results"])
    $("#balances-section").classList.remove("hidden")  
    $("#table").classList.remove("hidden")  
})

$("#cancelNewOperation").addEventListener("click",() => {  
    hiddenElement(["#new-operations-section"])  
    $("#balances-section").classList.remove("hidden")  
})

$("#addNewOperation").addEventListener("click",() => {
    e.preventDefault()
    const currentData = getData("operationsLS")
    currentData.push(saveNewOperation())
    setData("operationsLS",currentData)
})       

// SECTION EDIT OPERATION

$("#editBtnTable").addEventListener("click",() => {
    $("#edit-operations-section").classList.remove("hidden")
    hiddenElement(["#balancesections"])
})


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

    $("#edit-btn-category").addEventListener("click", (e) => {
        e.preventDefault()
        const updateEditedCategories = getData('categoriesLS')
        updateEditedCategories.push(saveNewEditedCategory())
        setData('categoriesLS', updateEditedCategories)
        categoriesList(categories)
        confirmEditCategory()
    })

    
    setData("operationsLS",operations);
    renderNewOperations(operations);







}
window.addEventListener("load", initializeApp)
