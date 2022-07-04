const check = (producto) => {
        if (!producto.nombre) {
            console.log("error en  nombre");
            return false;
        }
        if (!producto.descripcion) {
            console.log("error en descripcion");
            return false;
        }
        if (!producto.codigo) {
            console.log("error en codigo");
            return false;
        }
        if (!producto.precio) {
            console.log("error en precio");
            return false;
        } else {
            const precio = Number(producto.precio);
            if (isNaN(precio)) {
                console.log("error en precio");
                return false;
            }
        }
        if (!producto.thumbnail) {
            console.log("error en thumbnail");
            return false;
        }
        if (!producto.stock) {
            console.log("error en stock");
            return false;
        }
        return true;
    }

export default check;