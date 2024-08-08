let productList = document.querySelector("#productList");
let logoutBtn = document.querySelector(".logout");
let newProductForm = document.querySelector("#newProductForm");


let BaseUrl="http://localhost:2121/products"

async function getProducts() {
    let token = localStorage.getItem("token");
    let products = await axios.get(BaseUrl, {
        headers: {
            "token": token
        }
    });

    showProducts(products.data);
}

function showProducts(products) {
    console.log(products);
    productList.innerHTML = ""; // Mevcut ürünleri temizliyoruz
    products.forEach(element => {
        productList.innerHTML += `
        <div class="product-item" data-id="${element.id}">
            <span>${element.name} - $${element.price}</span>
            <button class="trash-btn" btn-id=${element._id}>🗑️</button>
        </div>
        `
        let delBtns = document.querySelectorAll(".trash-btn")
        delBtns.forEach(btn => {
       btn.addEventListener("click", async function(){
           let id = btn.getAttribute("btn-id")

           try {
               await axios.delete(`${BaseUrl}/${id}`, {
                   headers: {
                       "token": localStorage.getItem("token")
                   }
               })
               getProducts()
           } catch (error) {
               console.log(error);
               
           } 
       })
    });





    });


    // // Silme düğmelerine olay dinleyicisi ekliyoruz
    // let trashButtons = document.querySelectorAll(".trash-btn");
    // trashButtons.forEach(button => {
    //     button.addEventListener("click", deleteProduct);
    // });
}




newProductForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    let token = localStorage.getItem("token");
    let name = document.querySelector("#productName").value;
    let price = document.querySelector("#productPrice").value;

    try {
        let response = await axios.post("http://localhost:2121/products", {
            name: name,
            price: price
        }, {
            headers: {
                "token": token
            }
        });

        if(response.status === 200) {
            let newProduct = response.data;
            productList.innerHTML += `
            <div class="product-item" data-id="${newProduct.id}">
                <span>${newProduct.name} - $${newProduct.price}</span>
                <button class="trash-btn">🗑️</button>
            </div>
            `;

            // Yeni ürüne silme olay dinleyicisi ekliyoruz
            let newTrashButton = productList.querySelector(`.product-item[data-id="${newProduct.id}"] .trash-btn`);
            newTrashButton.addEventListener("click", deleteProduct);
        }
    } catch (error) {
        console.error("Error adding product:", error);
    }
});

// async function deleteProduct(event) {
//     let productItem = event.target.closest(".product-item");
//     let productId = productItem.getAttribute("data-id");
//     let token = localStorage.getItem("token");

//     try {
//         let response = await axios.delete(`http://localhost:2121/products/${productId}`, {
//             headers: {
//                 "token": token
//             }
//         });

//         if(response.status === 200) {
//             productItem.remove();
//         }
//     } catch (error) {
//         console.error("Error deleting product:", error);
//     }
// }

logoutBtn.addEventListener("click", function() {
    localStorage.removeItem("token");
    window.location.href = "register.html";
});

function tokenControlUI() {
    let token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "register.html";
    }
}

getProducts();
tokenControlUI();