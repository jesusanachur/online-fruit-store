// Almacenamiento local de pedidos
let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

async function hacerPedido() {
    const cantidad = document.getElementById('cantidad').value;
    const mensajeDiv = document.getElementById('mensaje');
    
    if (cantidad > 0) {
        try {
            // Simular API local sin servidor
            const pedido = {
                id: pedidos.length + 1,
                cantidad: Number(cantidad),
                fecha: new Date().toISOString(),
                producto: 'Frube',
                precio: 1.50
            };
            
            // Guardar pedido en localStorage
            pedidos.push(pedido);
            localStorage.setItem('pedidos', JSON.stringify(pedidos));
            
            // Calcular total
            const total = (pedido.cantidad * pedido.precio).toFixed(2);
            
            // Mostrar mensaje de éxito
            mensajeDiv.textContent = `¡Pedido realizado! Has pedido ${pedido.cantidad} Frube(s). Total: $${total}`;
            mensajeDiv.style.color = '#27ae60';
            
            // Opcional: Mostrar historial
            console.log('Historial de pedidos:', pedidos);
        } catch (err) {
            mensajeDiv.textContent = 'Error al procesar el pedido.';
            mensajeDiv.style.color = 'red';
        }
    } else {
        mensajeDiv.textContent = 'Por favor ingresa una cantidad válida.';
        mensajeDiv.style.color = 'red';
    }
}

// Función para ver historial de pedidos (opcional)
function verHistorial() {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    if (pedidos.length === 0) {
        alert('No hay pedidos en el historial.');
    } else {
        let historial = 'Historial de Pedidos:\n\n';
        pedidos.forEach(p => {
            historial += `Pedido #${p.id}: ${p.cantidad} Frube(s) - $${(p.cantidad * p.precio).toFixed(2)}\n`;
        });
        alert(historial);
    }
}

// Función para limpiar historial (opcional)
function limpiarHistorial() {
    localStorage.removeItem('pedidos');
    pedidos = [];
    alert('Historial limpiado.');
}
