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

$("#btn-options-nav").addEventListener("click", () => {
    $("#btn-options-nav").classList.add('hidden')
    $("#btn-cruz-options").classList.remove('hidden')
    $("#navbar-btn").classList.remove('hidden')
    $("#navbar-btn").classList.add("fixed", "top-19", "right-0", "mt-8", "shadow-md", "shadow-gray-300", "rounded-md")
})

$("#btn-cruz-options").addEventListener("click", () => {
    $("#btn-cruz-options").classList.add("hidden")
    $("#navbar-btn").classList.add("hidden")
    $("#btn-options-nav").classList.remove('hidden')
    $("#navbar-btn").classList.remove("fixed", "top-19", "right-0", "mt-8", "shadow-md", "shadow-gray-300", "rounded-md")
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
                <li class="m-2 p-0.5 bg-emerald-100  inset-y-0 left-0" value="${category.categoryName}">${category.categoryName}</li>
                <div class="flex inset-y-0 right-0">
                <button type="button" class="m-2 text-sky-700 mx-1 w-win edit-categories" onclick="viewEditCategory('${category.id}')">Editar</button>
                <button type="button" class="m-2 text-sky-700 mx-1 w-win delete-categories" onclick="deleteCategory('${category.id}')">Eliminar</button>
                </div>
            </div>
            `
            $("#categories-option-filters").innerHTML += `
            <option value="${category.categoryName}">${category.categoryName}</option>`
            $("#categories-option-operations").innerHTML += `<option value="${category.categoryName}">${category.categoryName}</option>`
            $("#categories-option-operations-edit").innerHTML += `<option value="${category.categoryName}">${category.categoryName}</option>`
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



// Funciones Kari
// OPERATIONS
const operations = getData("operationsLS") || []

// RENDERS
const renderNewOperations = (operations) => {
    if (Array.isArray(operations) && operations !== undefined && operations !== null) {
        for (const operation of operations) {
            //cleanContainer("#body-table")
            $("#body-table").innerHTML += `
        <div class="w-full flex justify-items-center p-3">
        <tr>
        <td class="font-bold pl-9">${operation.descripcion}</td>
        <td class="border-none border-2 rounded border-slate-500 bg-emerald-100 pl-8">${operation.categoria}</td>
        <td class="pl-8">${operation.fecha}</td>
        <td class="pl-7">$${operation.monto}</td> 
        <td class="pl-7">            
        <div"><button class="text-blue-400" onclick="showSectionEdit('${operation.id}')">Editar</button></div>
        <div><button class="text-blue-400" id="deleteBtnTable">Eliminar</button></div>  
        </td>                
        </tr> 
        `
        }
    }
}

const saveNewOperation = () => {
    return {
        id: randomId(),
        descripcion: $("#description-new-op").value,
        categoria: $("#categories-option-operations").value,
        fecha: $("#date").value,
        monto: $("#amount").value,
        tipo: $("#type-new-operation").value
    }
}

const showSectionEdit = (operationId) => {
    $("#balances-section").classList.add("hidden");
    $("#edit-operations-section").classList.remove("hidden");
    console.log("operationid----->",operationId);
    
     const operationSelected = getData ("operationsLS").find(operations => operations.id === operationId);
     console.log("operationSelected-----",operationSelected);
     $("#description-edit-op").value = operationSelected.descripcion;
     $("#categories-option-operations-edit").value = operationSelected.categoria;
     $("#dateEdit").value = operationSelected.fecha;
     $("#amountEdit").value = operationSelected.monto;
}


// EVENTS

setData("operationsLS", operations);

$("#addNewOperation").addEventListener("click", () => {
    e.preventDefault()
    hiddenElement(["#new-operations-section", "#no-results"])
    $("#balances-section").classList.remove("hidden")
    $("#table").classList.remove("hidden")
    const currentData = getData("operationsLS")
    currentData.push(saveNewOperation())
    setData("operationsLS", currentData)
    renderNewOperations()    
    renderBalance()
    window.location.reload() 
   
})

$("#cancelNewOperation").addEventListener("click", () => {
    $("#new-operations-section").classList.add("hidden")
    $("#balances-section").classList.remove("hidden")
    renderBalance()
})

$("#canceleditOperation").addEventListener("click", () => {
    $("#edit-operations-section").classList.add("hidden")
    $("#balances-section").classList.remove("hidden")
    renderBalance()
})




/* FILTROS */
//show/hide events
$("#hide-filters").addEventListener("click", () => {
    hiddenElement(["#container-filters", "#hide-filters"]);
    $("#show-filters").classList.remove('hidden')
})

$("#show-filters").addEventListener("click", () => {
    $("#show-filters").classList.add('hidden')
    $("#container-filters").classList.remove('hidden');
    $("#hide-filters").classList.remove('hidden')
})

//filtro POR TIPO Y CATEGORIA
const filterOperations = () => {
    let filteredOperations = operations;


    // Aplicar filtros según el tipo
    switch ($("#type-operation-balances-section").value) {
        case "all":
            operations;
            break;
        case "spent":
            filteredOperations = filteredOperations.filter(operation => operation.tipo === "spent");
            break;
        case "revenue":
            filteredOperations = filteredOperations.filter(operation => operation.tipo === "revenue");
            break;
        default:
            operations;
    }

    // Aplicar filtros según la categoría
    if ($("#categories-option-filters").value === "todas") {
        filteredOperations;
    }
    else if ($("#categories-option-filters").value !== "") {
        filteredOperations = filteredOperations.filter(operation => operation.categoria === $("#categories-option-filters").value);
    }
    // Aplicar filtros según la fecha
    if ($("#from-input").value !== "") {
        filteredOperations = filteredOperations.filter(operation => new Date(operation.fecha) >= new Date($("#from-input").value));
    }

    // Ordenar según el criterio seleccionado
    switch ($("#sort-by-select").value) {
        case "recent":
            filteredOperations.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            break
        case "least-recent":
            filteredOperations.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
            break
        case "highest-amount":
            filteredOperations.sort((a, b) => b.monto - a.monto);
            break
        case "lowest-amount":
            filteredOperations.sort((a, b) => a.monto - b.monto);
            break
        case "a-to-z":
            filteredOperations.sort((a, b) => a.descripcion - b.descripcion);
            break
        case "z-to-a":
            filteredOperations.sort((b, a) => b.descripcion - a.descripcion);
            break
        default:
            filteredOperations.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    }

    renderNewOperations(filteredOperations);
    renderBalance(filteredOperations)
};



//BALANCES
const balanceCostProfit = (array, tipo) => {

    const filterOperation = array.filter((arr) => {
        return arr.tipo === tipo && arr
    })
    const spent = filterOperation.reduce((acc, arr) => {
        return acc + Number(arr.monto)
    }, 0)
    return spent
}

const totalBalance = balanceCostProfit(operations, "revenue") - balanceCostProfit(operations, "spent")

const updatedBalance = () => {
    $("#total-profit").innerHTML = `+$${balanceCostProfit(operations, "revenue")}`
    $("#total-cost").innerHTML = `+$${balanceCostProfit(operations, "spent")}`
    $("#total").innerHTML = `$${totalBalance}`
}

const resetBalance = () => {
    $("#total-profit").innerHTML = `+$0`
    $("#total-cost").innerHTML = `+$0`
    $("#total").innerHTML = `$0`
}

const renderBalance = () => {
    if(getData("operationsLS") === "[]"){
        resetBalance()
    }
    else {
        updatedBalance()
    }
}
//renderBalance()

//INICIALIZE FUNCTION
const initializeApp = () => {
    setData('categoriesLS', categories);
    categoriesList(categories);
    renderNewOperations(operations);
    renderBalance(operations)
    $("#categories-option-filters").innerHTML += `<option value="todas" selected>Todas</option>`

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

    $("#addNewOperation").addEventListener("click", (e) => {
        hiddenElement(["#new-operations-section", "#no-results"])
        $("#balances-section").classList.remove("hidden")  
        $("#table").classList.remove("hidden")
        e.preventDefault()     
        const currentData = getData("operationsLS")
        currentData.push(saveNewOperation())
        setData("operationsLS",currentData)      
        window.location.reload()
    })     
}
window.addEventListener("load", initializeApp())

$("#type-operation-balances-section").addEventListener("change", () => {
    cleanContainer("#body-table");
    filterOperations()
    renderBalance()
})
$("#categories-option-filters").addEventListener("change", () => {
    cleanContainer("#body-table");
    filterOperations()
    renderBalance()
});

$("#from-input").addEventListener("change", () => {
    cleanContainer("#body-table");
    filterOperations()
    renderBalance()
});
$("#sort-by-select").addEventListener("change", () => {
    cleanContainer("#body-table");
    filterOperations()
    renderBalance()
});

