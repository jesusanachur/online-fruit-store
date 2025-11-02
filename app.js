async function hacerPedido() {
    const cantidad = document.getElementById('cantidad').value;
    const mensajeDiv = document.getElementById('mensaje');
    if (cantidad > 0) {
        try {
            const res = await fetch('http://localhost:3000/api/pedidos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cantidad: Number(cantidad) })
            });
            if (!res.ok) throw new Error('Error al hacer el pedido');
            const data = await res.json();
            mensajeDiv.textContent = `¡Pedido realizado! Has pedido ${data.cantidad} Frube(s).`;
            mensajeDiv.style.color = '#27ae60';
        } catch (err) {
            mensajeDiv.textContent = 'Error al conectar con la API.';
            mensajeDiv.style.color = 'red';
        }
    } else {
        mensajeDiv.textContent = 'Por favor ingresa una cantidad válida.';
        mensajeDiv.style.color = 'red';
    }
}
