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
    hiddenElement(["#category-section", "#balances-section", "#new-operations-section", "#category-edit-section"]);

	if(getData('operationsLS') != null && getData('operationsLS').length > 0){
		$("#no-reports-container").classList.add("hidden");
		$("#summary-container").classList.remove("hidden");
	}
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
    },
];

const categories = getData("categoriesLS") || categoriesListDefault

const categoriesList = (categories) => {
    cleanContainer("#categories-list")
    cleanContainer("#categories-option-filters")
    cleanContainer("#categories-option-operations")
    $("#categories-option-filters").innerHTML += `<option value="todas">Todas</option>`
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
    categoriesList(categories)
}

const saveNewCategory = () => {
    return {
        categoryName: $("#input-add-category").value,
        id: randomId(),
    }
}

$("#boton-cancelar-editar-categoria").onclick = () => {
    hiddenElement(["#category-edit-section", "#new-operations-section", "#reports-section", "#balances-section"]);
    $("#category-section").classList.remove('hidden')
}

$("#add-btn-category").addEventListener("click", (e) => {
    e.preventDefault();
    const updateCategories = getData('categoriesLS');
    updateCategories.push(saveNewCategory());
    setData('categoriesLS', updateCategories);
    categoriesList(categories);
    window.location.reload()
})

$("#edit-btn-category").addEventListener("click", (e) => {
    e.preventDefault();
    const updateEditedCategories = getData('categoriesLS');
    setData('categoriesLS', updateEditedCategories);
    confirmEditCategory(updateEditedCategories);
    categoriesList(categories);
    window.location.reload(["#categories-list", "#categories-option-filters", "#categories-option-operations", "#categories-option-operations-edit"])
})

// OPERATIONS
const operations = getData("operationsLS") || []
const renderNewOperations = (operations) => {
    if (Array.isArray(operations) && operations !== undefined && operations !== null) {
        for (const operation of operations) {
            $("#body-table").innerHTML += `
        <div class="w-full flex justify-items-center p-3">
        <tr>
        <td class="font-bold pl-2 lg:pl-2">${operation.descripcion}</td>
        <td class="border-none border-2 rounded border-slate-500 bg-emerald-100 pl-2">${operation.categoria}</td>
        <td class="pl-2">${operation.fecha}</td>
        <td class="pl-2">${ItemRenderAmount(operation.tipo,operation.monto)}</td> 
        <td class="pl-2">            
        <div"><button class="text-blue-400" onclick="showSectionEdit('${operation.id}')">Editar</button></div>
        <div><button class="text-blue-400" onclick="deleteItem('${operation.id}')">Eliminar</button></div>  
        </td>                
        </tr> 
        `
        }
    } if (getData('operationsLS').length > 0) {
        $("#no-results").classList.add("hidden");
        $("#table").classList.remove("hidden");
    }
}

const ItemRenderAmount = (tipo,amount)=>{
	let itemRenderer = amount;
	if(tipo === 'spent' ){
		itemRenderer = `<span class = 'text-red-500'>$${amount}</span>`;
	}else{
		itemRenderer = `<span class = 'text-green-500'>$${amount}</span>`;
	}

	return itemRenderer;
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

const saveEditOperation = (operationId) => {
    return {
		id:operationId,
		descripcion: $("#description-edit-op").value,
		categoria: $("#categories-option-operations-edit").value,
		fecha: $("#dateEdit").value,
		monto: $("#amountEdit").value,
		tipo: $("#type").value
    }
}

const showSectionEdit = (operationId) => {
    $("#balances-section").classList.add("hidden");
    $("#edit-operations-section").classList.remove("hidden");
    $("#btnEditOperation").setAttribute("data-id",operationId)
    const operationSelected = getData ("operationsLS").find(operations => operations.id === operationId);
    $("#description-edit-op").value = operationSelected.descripcion;
    $("#categories-option-operations-edit").value = operationSelected.categoria;
    $("#dateEdit").value = operationSelected.fecha;
    $("#amountEdit").value = operationSelected.monto;
	$("#type").value = operationSelected.tipo;
}

const deleteItem =  (operationId) => {
	const data = getData('operationsLS');
	const itemSelected = data.filter(item => item.id === operationId);

	if(confirm('¿seguro desea eliminar '+ itemSelected[0].descripcion+ '?')){
		const newData =data.filter((item => item.id != operationId ));
	
		setData('operationsLS',newData);
		window.location.reload();
	}
}

// EVENTS
    
$("#cancelNewOperation").addEventListener("click", (e) => {
    $("#new-operations-section").classList.add("hidden")
    $("#balances-section").classList.remove("hidden")
    renderBalance()
}) 

$("#canceleditOperation").addEventListener("click", (e) => {
    $("#edit-operations-section").classList.add("hidden")
    $("#balances-section").classList.remove("hidden")
    renderBalance()
})

$("#addNewOperation").addEventListener("click", (e) => {
    hiddenElement(["#new-operations-section"])
    $("#balances-section").classList.remove("hidden")  
    $("#table").classList.remove("hidden")
    e.preventDefault()     
    const currentData = getData("operationsLS")
    currentData.push(saveNewOperation())
    setData("operationsLS",currentData)     
    window.location.reload()
})     

$("#btnEditOperation").addEventListener("click", (e) => {
    e.preventDefault()
    const operationId = $("#btnEditOperation").getAttribute("data-id")
    const currentData = getData("operationsLS").map(operations => {
        if (operations.id === operationId){
			return saveEditOperation(operationId);
        	}
		return operations;
        })
    
	setData("operationsLS",currentData);
    window.location.reload();
})

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


const filterOperations = () => {
    let filteredOperations = operations;

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

    if ($("#categories-option-filters").value === "todas") {
        filteredOperations;
    }
    else if ($("#categories-option-filters").value !== "") {
        filteredOperations = filteredOperations.filter(operation => operation.categoria === $("#categories-option-filters").value);
    }

    if ($("#from-input").value !== "") {
        filteredOperations = filteredOperations.filter(operation => new Date(operation.fecha) >= new Date($("#from-input").value));
    }

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
            filteredOperations.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
            break
        case "z-to-a":
            filteredOperations.sort((b, a) => b.descripcion.localeCompare(a.descripcion));
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

//Reportes
const updateReports = () =>{
       const highestEarningCategory = getHighestEarningCategory();
       const highestSpendingCategory = getHighestSpendingCategory();
       const highestBalanceCategory = getHighestBalanceCategory(operations, categories);
      
	   const highestEarningMonth = getHighestRevenueMonth();
       const highestSpendingMonth = getHighestSpentMonth();   

   };


const getHighestEarningCategory = () => {

    const getCategoryWithHighestEarning = (operations) => {
        const revenueByCategory = {};
        operations.forEach(operation => {
            if(operation.tipo === "revenue") {
                if(!revenueByCategory[operation.categoria]) {
                    revenueByCategory[operation.categoria] = 0;
                }
                revenueByCategory[operation.categoria] += parseFloat(operation.monto);
            }
        });
        let highestEarningCategory = null;
        let highestEarningAmount = 0;


        for(const category in revenueByCategory) {
            if(revenueByCategory[category] > highestEarningAmount) {
                highestEarningCategory = category;
                highestEarningAmount = revenueByCategory[category];
            }
        }
        return {
            category: highestEarningCategory,
            amount: highestEarningAmount.toFixed(2)
        };
        
    };

	const highestEarningCategory = getCategoryWithHighestEarning(operations);

    $("#highest-earning-category-name").innerHTML = highestEarningCategory.category || "No hay registros de categorías con ganancias";
    $("#highest-earning-category-amount").innerHTML = `$${highestEarningCategory.amount || "+$0.00"}`;

}

//mayor gasto categoria
const getHighestSpendingCategory = () => {
    const spendingByCategory = {};
    for(const operation of operations) {
        if(operation.tipo === "spent") {
            if(spendingByCategory[operation.categoria]) {
                spendingByCategory[operation.categoria] += parseFloat(operation.monto);
            } else {
            spendingByCategory[operation.categoria] = parseFloat(operation.monto);
            }
        }
    }
    let highestSpendingCategory = null;
    let highestSpendingAmount = 0;

    for(const category in spendingByCategory){
        if(spendingByCategory[category] > highestSpendingAmount) {
            highestSpendingAmount = spendingByCategory[category];
            highestSpendingCategory = category;
        }
    }

    if(highestSpendingCategory) {
        $("#highest-spending-category-name").innerText = highestSpendingCategory;
        $("#highest-spending-category-amount").innerHTML = `-$${highestSpendingAmount.toFixed(2)}`;
    } else {
        $("#highest-spending-category-name").innerText = "No hay registros de categorías con gasto";
        $("#highest-spending-category-amount").innerHTML = "-$0.00";
    }
};

const getHighestBalanceCategory = (operations, categories) => {
    let highestBalanceCategory = null;
    let maxBalance = 0;

    categories.forEach(category => {
        const operationsForCategory = operations.filter(operation => operation.categoria === category.categoryName);
        const balance = operationsForCategory.reduce((acc, operation) => {
            if (operation.tipo === 'revenue') {
                return acc + parseFloat(operation.monto);
            } else {
                return acc - parseFloat(operation.monto);
            }
        }, 0);

        if (balance > maxBalance) {
            maxBalance = balance;
            highestBalanceCategory = category.categoryName;
        }
    });
    if (highestBalanceCategory) {
        $("#highest-balance-category-name").innerText = highestBalanceCategory || "No hay registros de categorías";
        $("#highest-balance-category-amount").innerText = `$${maxBalance ||"$0.00"}`;
    }
}

const getMonthWithHighestRevenue = () => {
    const monthlyRevenue = {};

    operations.forEach(operation => {
        const operationDate = new Date(operation.fecha);
        const monthYearKey = `${operationDate.getMonth()}-${operationDate.getFullYear()}`;

        if (!monthlyRevenue[monthYearKey]) {
            monthlyRevenue[monthYearKey] = 0;
        }

        if (operation.tipo === "revenue") {
            monthlyRevenue[monthYearKey] += parseFloat(operation.monto);
        }
    });

    let highestMonth = null;
    let highestRevenue = 0;

    for (const key in monthlyRevenue) {
        if (monthlyRevenue[key] > highestRevenue) {
            highestRevenue = monthlyRevenue[key];
            highestMonth = key;
        }
    }

    return {
        month: highestMonth,
        revenue: highestRevenue.toFixed(2),
    };
};

const getHighestRevenueMonth = () => {
    const highestRevenueMonth = getMonthWithHighestRevenue();
    if(highestRevenueMonth.month != null){
    const [month, year] = highestRevenueMonth.month.split(',')[0].split('-');

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const monthName = monthNames[parseInt(month)];
    $("#highest-earning-month-name").innerHTML = `${monthName} ${year}`;
    $("#highest-earning-month-amount").innerHTML = `+$${highestRevenueMonth.revenue}`;
    }
}

const getMonthWithHighesSpending = () => {
    const monthlySpent = {};


    operations.forEach(operation => {
        const operationDate = new Date(operation.fecha);
        const monthYearKey = `${operationDate.getMonth()}-${operationDate.getFullYear()}`;

        if (!monthlySpent[monthYearKey]) {
            monthlySpent[monthYearKey] = 0;
        }

        if (operation.tipo === "spent") {
            monthlySpent[monthYearKey] += parseFloat(operation.monto);
        }
    });

 
    let highestMonth = null;
    let highestSpent = 0;

    for (const key in monthlySpent) {
        if (monthlySpent[key] > highestSpent) {
            highestSpent = monthlySpent[key];
            highestMonth = key;
        }
    }

    return {
        month: highestMonth,
        spent: highestSpent.toFixed(2),
    };
};

const getHighestSpentMonth = () => {
    const highestSpentMonth = getMonthWithHighesSpending();
	if(highestSpentMonth.month != null){
		const [month, year] = highestSpentMonth.month.split(',')[0].split('-');

		const monthNames = [
			"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
			"Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
		];

		const monthName = monthNames[parseInt(month)];
		$("#highest-spending-month-name").innerHTML = `${monthName} ${year}`;
		$("#highest-spending-month-amount").innerHTML = `+$${highestSpentMonth.spent}`;
	}	
};



//INICIALIZE FUNCTION
const initializeApp = () => {
    setData("operationsLS", operations);
    setData('categoriesLS', categories);
    categoriesList(categories);

    renderNewOperations(operations);
    renderBalance(operations);
    updateReports(operations);

}
window.addEventListener("load", initializeApp());