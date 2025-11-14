document.addEventListener('DOMContentLoaded', function() {
    // Estado del carrito
    let carrito = [];
    
    // Elementos del DOM
    const productosGrid = document.querySelector('.productos-grid');
    const carritoItems = document.getElementById('carrito-items');
    const carritoTotal = document.getElementById('carrito-total');
    const cartCount = document.getElementById('cart-count');
    const pagarAhoraBtn = document.getElementById('pagar-ahora');
    const productosSection = document.getElementById('productos');
    const pasarelaPago = document.getElementById('pasarela-pago');
    const btnVolver = document.querySelector('.btn-volver');
    const resumenItems = document.getElementById('resumen-items');
    const montoTotal = document.getElementById('monto-total');
    const amountDisplay = document.getElementById('amount-display');
    const cardNumber = document.getElementById('card-number');
    const expiry = document.getElementById('expiry');
    const cvv = document.getElementById('cvv');
    const email = document.getElementById('email');
    const payButton = document.getElementById('pay-button');
    const receipt = document.getElementById('receipt');
    const receiptAmount = document.getElementById('receipt-amount');
    const receiptReference = document.getElementById('receipt-reference');
    const receiptDate = document.getElementById('receipt-date');
    const nuevaCompraBtn = document.getElementById('nueva-compra');
    const verReciboBtn = document.getElementById('ver-recibo');

    // Datos de ejemplo de productos
    const productos = [
        {
            id: 1,
            nombre: 'Frube de Fresa',
            precio: 1.50,
            imagen: 'https://www.danone.es/sites/g/files/wkmsbl1666/files/styles/product_image/public/frube-fresa.png',
            cantidad: 0
        },
        {
            id: 2,
            nombre: 'Frube de Melocotón',
            precio: 1.50,
            imagen: 'https://www.danone.es/sites/g/files/wkmsbl1666/files/styles/product_image/public/frube-melocoton.png',
            cantidad: 0
        },
        {
            id: 3,
            nombre: 'Frube de Plátano',
            precio: 1.50,
            imagen: 'https://www.danone.es/sites/g/files/wkmsbl1666/files/styles/product_image/public/frube-platano.png',
            cantidad: 0
        }
    ];

    // Inicializar la tienda
    function inicializarTienda() {
        // Actualizar contador del carrito
        actualizarContadorCarrito();
        
        // Cargar carrito desde localStorage si existe
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado);
            actualizarCarrito();
        }
        
        // Configurar eventos
        configurarEventos();
    }
    
    // Configurar eventos
    function configurarEventos() {
        // Botón "Pagar Ahora"
        pagarAhoraBtn.addEventListener('click', mostrarPasarelaPago);
        
        // Botón "Volver al carrito"
        btnVolver.addEventListener('click', volverACarrito);
        
        // Botón "Nueva Compra"
        nuevaCompraBtn.addEventListener('click', reiniciarCompra);
        
        // Botón "Ver Recibo"
        verReciboBtn.addEventListener('click', verRecibo);
        
        // Validar número de tarjeta (agrega espacios cada 4 dígitos)
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s+/g, '');
            if (value.length > 0) {
                value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
            }
            e.target.value = value;
        });

        // Formatear fecha de vencimiento (MM/AA)
        expiry.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });

        // Validar solo números en CVV
        cvv.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });

        // Procesar pago
        payButton.addEventListener('click', procesarPago);
    }
    
    // Cambiar cantidad de un producto
    window.cambiarCantidad = function(btn, cambio) {
        const contenedor = btn.closest('.cantidad');
        const cantidadElemento = contenedor.querySelector('.cantidad-num');
        let cantidad = parseInt(cantidadElemento.textContent) + cambio;
        
        // No permitir cantidades negativas
        if (cantidad < 0) cantidad = 0;
        
        cantidadElemento.textContent = cantidad;
        
        // Actualizar el botón de agregar al carrito
        const btnAgregar = contenedor.nextElementSibling;
        btnAgregar.disabled = cantidad === 0;
    }
    
    // Agregar producto al carrito
    window.agregarAlCarrito = function(btn) {
        const productoCard = btn.closest('.producto-card');
        const productoId = parseInt(productoCard.dataset.id);
        const cantidad = parseInt(productoCard.querySelector('.cantidad-num').textContent);
        
        if (cantidad <= 0) return;
        
        // Buscar si el producto ya está en el carrito
        const productoEnCarrito = carrito.find(item => item.id === productoId);
        
        if (productoEnCarrito) {
            // Si ya está en el carrito, actualizar cantidad
            productoEnCarrito.cantidad += cantidad;
        } else {
            // Si no está en el carrito, agregarlo
            const producto = productos.find(p => p.id === productoId);
            if (producto) {
                carrito.push({
                    ...producto,
                    cantidad: cantidad
                });
            }
        }
        
        // Actualizar la interfaz
        actualizarCarrito();
        
        // Reiniciar contador
        const cantidadElemento = productoCard.querySelector('.cantidad-num');
        cantidadElemento.textContent = '0';
        
        // Mostrar notificación
        mostrarNotificacion('Producto agregado al carrito');
    }
    
    // Actualizar carrito
    function actualizarCarrito() {
        // Guardar en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        // Actualizar contador
        actualizarContadorCarrito();
        
        // Actualizar lista de productos en el carrito
        if (carrito.length === 0) {
            carritoItems.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
            pagarAhoraBtn.disabled = true;
            return;
        }
        
        // Habilitar botón de pago
        pagarAhoraBtn.disabled = false;
        
        // Generar HTML de los productos en el carrito
        let html = '';
        let total = 0;
        
        carrito.forEach((producto, index) => {
            const subtotal = producto.precio * producto.cantidad;
            total += subtotal;
            
            html += `
                <div class="carrito-item">
                    <div class="item-info">
                        <img src="${producto.imagen}" alt="${producto.nombre}" class="item-img">
                        <div class="item-details">
                            <h4>${producto.nombre}</h4>
                            <p class="item-price">$${producto.precio.toFixed(2)} x ${producto.cantidad}</p>
                        </div>
                    </div>
                    <div class="item-actions">
                        <span class="item-subtotal">$${subtotal.toFixed(2)}</span>
                        <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        carritoItems.innerHTML = html;
        carritoTotal.textContent = total.toFixed(2);
    }
    
    // Eliminar producto del carrito
    window.eliminarDelCarrito = function(index) {
        carrito.splice(index, 1);
        actualizarCarrito();
        mostrarNotificacion('Producto eliminado');
    }
    
    // Actualizar contador del carrito
    function actualizarContadorCarrito() {
        const totalItems = carrito.reduce((total, producto) => total + producto.cantidad, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Mostrar notificación
    function mostrarNotificacion(mensaje) {
        // Implementar notificación (puedes usar un toast o alerta personalizada)
        console.log(mensaje);
    }
    
    // Mostrar pasarela de pago
    function mostrarPasarelaPago() {
        if (carrito.length === 0) return;
        
        // Calcular total
        const total = carrito.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
        
        // Actualizar resumen de compra
        actualizarResumenCompra();
        
        // Actualizar monto total
        montoTotal.textContent = `$${total.toFixed(2)}`;
        amountDisplay.textContent = total.toFixed(2);
        
        // Mostrar pasarela y ocultar productos
        productosSection.classList.add('hidden');
        pasarelaPago.classList.remove('hidden');
    }
    
    // Volver al carrito
    function volverACarrito() {
        productosSection.classList.remove('hidden');
        pasarelaPago.classList.add('hidden');
        receipt.classList.add('hidden');
    }
    
    // Actualizar resumen de compra
    function actualizarResumenCompra() {
        let html = '';
        let total = 0;
        
        carrito.forEach(producto => {
            const subtotal = producto.precio * producto.cantidad;
            total += subtotal;
            
            html += `
                <div class="resumen-item">
                    <span>${producto.nombre} x${producto.cantidad}</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
            `;
        });
        
        resumenItems.innerHTML = html;
    }
    
    // Procesar pago
    function procesarPago(e) {
        e.preventDefault();
        
        if (!validarFormularioPago()) {
            return;
        }
        
        // Mostrar carga
        payButton.disabled = true;
        payButton.innerHTML = '<i class="material-icons">hourglass_empty</i> Procesando...';
        
        // Simular tiempo de procesamiento
        setTimeout(() => {
            // Generar referencia aleatoria
            const reference = 'PAY-' + Math.random().toString(36).substr(2, 8).toUpperCase();
            const today = new Date();
            const dateStr = today.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Calcular total
            const total = carrito.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
            
            // Actualizar recibo
            receiptAmount.textContent = `$${total.toFixed(2)}`;
            receiptReference.textContent = reference;
            receiptDate.textContent = dateStr;
            
            // Mostrar recibo y ocultar formulario
            pasarelaPago.classList.add('hidden');
            receipt.classList.remove('hidden');
            
            // Vaciar carrito
            carrito = [];
            actualizarCarrito();
            
            // Guardar en historial (opcional)
            guardarEnHistorial(reference, total, dateStr);
            
        }, 2000);
    }
    
    // Validar formulario de pago
    function validarFormularioPago() {
        let isValid = true;
        const inputs = [cardNumber, expiry, cvv, email];
        
        // Validar que todos los campos estén llenos
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#e74c3c';
                isValid = false;
            } else {
                input.style.borderColor = '#ddd';
            }
        });

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value && !emailRegex.test(email.value)) {
            email.style.borderColor = '#e74c3c';
            isValid = false;
        }

        // Validar número de tarjeta (16 dígitos)
        const cardNumberDigits = cardNumber.value.replace(/\s+/g, '');
        if (cardNumberDigits.length !== 16 || !/^\d+$/.test(cardNumberDigits)) {
            cardNumber.style.borderColor = '#e74c3c';
            isValid = false;
        }

        // Validar CVV (3 o 4 dígitos)
        if (!/^\d{3,4}$/.test(cvv.value)) {
            cvv.style.borderColor = '#e74c3c';
            isValid = false;
        }

        // Validar fecha de vencimiento
        const expiryValue = expiry.value;
        if (!/^\d{2}\/\d{2}$/.test(expiryValue)) {
            expiry.style.borderColor = '#e74c3c';
            isValid = false;
        }

        return isValid;
    }
    
    // Guardar en historial (simulación)
    function guardarEnHistorial(referencia, total, fecha) {
        // Aquí podrías guardar en localStorage o enviar a un servidor
        console.log('Compra guardada:', { referencia, total, fecha });
    }
    
    // Reiniciar compra
    function reiniciarCompra() {
        // Limpiar formulario
        document.querySelector('form').reset();
        
        // Volver a la sección de productos
        productosSection.classList.remove('hidden');
        receipt.classList.add('hidden');
        
        // Restaurar botón de pago
        payButton.disabled = false;
        payButton.innerHTML = '<i class="material-icons">lock</i> Pagar $<span id="amount-display">0.00</span>';
    }
    
    // Ver recibo
    function verRecibo() {
        // Aquí podrías implementar la generación de un PDF o mostrar más detalles
        alert('Función de ver recibo en desarrollo');
    }
    
    // Inicializar la tienda
    inicializarTienda();
});
