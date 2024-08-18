document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('modalContent');
    const closeBtn = document.querySelector('.close');

    document.querySelectorAll('.product-item').forEach(product => {
        product.addEventListener('click', (event) => {
            event.preventDefault();
            const productId = product.getAttribute('data-m-ob-id');
            if (productId) {
                showProductDetail(productId);
                modal.showModal(); // Open the dialog
            } else {
                console.error('Product ID is undefined.');
            }
        });
    });

    closeBtn?.addEventListener('click', closeModal);

    modal.addEventListener('cancel', closeModal); // Handles Esc key closing

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    function closeModal() {
        modal.close(); // Close the dialog
        modalContent.querySelector('#detailContent').innerHTML = '';
        modalContent.querySelector('#similarProductsContent').innerHTML = '';
        history.replaceState(null, '', window.location.pathname); // Reset URL when modal is closed
    }

    function showLoading(contentSelector) {
        const contentElement = modalContent.querySelector(contentSelector);
        if (contentElement) contentElement.innerHTML = '<p>Loading...</p>';
    }

    async function fetchProductDetail(productId) {
        try {
            const response = await fetch(`http://localhost:3000/products/${productId}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();

            const imageUrl = data.image.startsWith('http') ? data.image : `/src/${data.image}`;

            modalContent.querySelector('#detailContent').innerHTML = `
                <h2>${data.name}</h2>
                <img src="${imageUrl}" alt="${data.name}" style="width:100%">
                <p>${data.description}</p>
                <p><strong>Cena:</strong> ${data.price}</p>
                <ul>
                    ${data.parameters.map(param => `<li>${param.name}: ${param.value}</li>`).join('')}
                </ul>
                <button id="similarProductsTab">Podobné produkty</button>
            `;

            const similarProductsTab = document.getElementById('similarProductsTab');
            similarProductsTab?.addEventListener('click', () => showSimilarProducts(productId));
        } catch (error) {
            console.error('Error fetching product detail:', error);
            modalContent.querySelector('#detailContent').innerHTML = '<p>Sorry, we could not load the product details.</p>';
        }
    }

    async function fetchSimilarProducts(productId) {
        try {
            const response = await fetch(`http://localhost:3000/similarProducts?productId=${productId}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();

            const similarProductsData = data.find(item => item.productId === parseInt(productId, 10));
            if (!similarProductsData || !Array.isArray(similarProductsData.products)) {
                throw new Error('Products data is undefined or not an array');
            }

            const similarProductsContent = modalContent.querySelector('#similarProductsContent');
            if (!similarProductsContent) {
                console.error('similarProductsContent element not found');
                return;
            }
            similarProductsContent.innerHTML = `
                <ul>
                    ${similarProductsData.products.map(product => `
                        <li>
                            <img src="${product.image}" alt="${product.name}" style="width:50px">
                            <a href="#" data-m-ob-id="${product.id}">${product.name}</a> - ${product.price}
                        </li>
                    `).join('')}
                </ul>
            `;

            similarProductsContent.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const similarProductId = link.getAttribute('data-m-ob-id');
                    if (similarProductId) {
                        showProductDetail(similarProductId);
                    } else {
                        console.error('Similar product ID is undefined.');
                    }
                });
            });
        } catch (error) {
            console.error('Error fetching similar products:', error);
            const similarProductsContent = modalContent.querySelector('#similarProductsContent');
            if (similarProductsContent) {
                similarProductsContent.innerHTML = '<p>Sorry, we could not load similar products.</p>';
            }
        }
    }

    function showProductDetail(productId) {
        history.pushState({ tab: 'detail' }, '', `/product/${productId}`);
        showLoading('#detailContent');
        fetchProductDetail(productId);
        modal.showModal(); // Open the dialog
    }

    function showSimilarProducts(productId) {
        history.pushState({ tab: 'similar' }, '', `/product/${productId}/similar`);
        showLoading('#similarProductsContent');
        fetchSimilarProducts(productId);
        modal.showModal(); // Open the dialog
    }

    // Check current URL and load the appropriate tab on page load
    function checkCurrentTab() {
        const url = new URL(window.location.href);
        const pathParts = url.pathname.split('/');
        const productId = pathParts[2]; // In the new URL structure, the product ID is the third part

        if (productId) {
            if (url.pathname.endsWith('/similar')) {
                showSimilarProducts(productId);
            } else if (url.pathname.includes('/product')) {
                showProductDetail(productId);
            }
        }
    }

    checkCurrentTab(); // Automatically open modal based on the URL
});
