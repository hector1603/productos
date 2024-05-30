import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View, Button, Alert } from 'react-native';

const productosIniciales = [
  { nombre: 'Doritos', categoria: 'Snacks', precioCompra: 0.40, precioVenta: 0.45, id: 100 },
  { nombre: 'Manicho', categoria: 'Golosinas', precioCompra: 0.20, precioVenta: 0.25, id: 101 },
  { nombre: 'Chipilo', categoria: 'Snacks', precioCompra: 0.80, precioVenta: 1.10, id: 105 }
];

let esNuevo = true;
let codigoProduct = 0;

export default function App() {

  const [txtCodigo, setTxtCodigo] = useState('');
  const [txtNombre, setTxtNombre] = useState('');
  const [txtCategoria, setTxtCategoria] = useState('');
  const [txtPrecioCompra, setTxtPrecioCompra] = useState('');
  const [txtPrecioVenta, setTxtPrecioVenta] = useState('');
  const [cantidadProductos, setCantidadProductos] = useState(productosIniciales.length);
  const [listaProductos, setListaProductos] = useState(productosIniciales);

  useEffect(() => {
    if (txtPrecioCompra !== '') {
      let precioCompraFloat = parseFloat(txtPrecioCompra);
      let precioVenta = (precioCompraFloat * 20 / 100) + precioCompraFloat;
      setTxtPrecioVenta(precioVenta.toFixed(2).toString());
    } else {
      setTxtPrecioVenta('');
    }
  }, [txtPrecioCompra]);

  let ItemProducto = (props) => {
    return (
      <View style={styles.item}>
        <View style={styles.codigo}>
          <Text>{props.identificador}</Text>
        </View>

        <View style={styles.name}>
          <Text style={styles.datos}>{props.producto.nombre}</Text>
          <Text style={styles.category}>{props.producto.categoria}</Text>
        </View>

        <View style={styles.prices}>
          <Text style={styles.price}>USD {props.producto.precioVenta.toFixed(2)}</Text>
        </View>

        <View style={styles.action}>
          <Button
            color='aliceblue'
            title='✍🏼'
            onPress={() => {
              setTxtCodigo(props.producto.id.toString());
              setTxtNombre(props.producto.nombre);
              setTxtCategoria(props.producto.categoria);
              setTxtPrecioCompra(props.producto.precioCompra.toString());
              setTxtPrecioVenta(props.producto.precioVenta.toString());
              esNuevo = false;
              codigoProduct = listaProductos.findIndex(p => p.id === props.producto.id);
            }}
          />
          <Button
            color='aliceblue'
            title='🚮'
            onPress={() => {
              eliminarProducto(props.producto.id);
            }}
          />
        </View>
      </View>
    );
  }

  const nuevoProduct = () => {
    setTxtCodigo('');
    setTxtNombre('');
    setTxtCategoria('');
    setTxtPrecioCompra('');
    setTxtPrecioVenta('');
    esNuevo = true;
  }

  const existeProducto = () => {
    for(let i = 0; i < listaProductos.length; i++) {
      if(listaProductos[i].id === parseInt(txtCodigo)) {
        return true;
      }
    }
    return false;
  }

  const validarCampos = () => {
    if (!txtCodigo || !txtNombre || !txtCategoria || !txtPrecioCompra || !txtPrecioVenta) {
      Alert.alert("INFO", "Todos los campos son obligatorios.");
      return false;
    }
    return true;
  }

  const guardarProducto = () => {
    if (!validarCampos()) return;

    let precioVenta = parseFloat(txtPrecioVenta);
    if(esNuevo) {
      if(existeProducto()) {
        Alert.alert("INFO", "El producto don codigo" + txtCodigo + " ya fue registrado.")
      } else {
        let product = { nombre: txtNombre, categoria: txtCategoria, precioCompra: parseFloat(txtPrecioCompra), precioVenta: precioVenta, id: parseInt(txtCodigo) }
        setListaProductos([...listaProductos, product]);
        setCantidadProductos(listaProductos.length + 1);
      }
    } else {
      const nuevosProductos = [...listaProductos];
      nuevosProductos[codigoProduct] = { nombre: txtNombre, categoria: txtCategoria, precioCompra: parseFloat(txtPrecioCompra), precioVenta: precioVenta, id: parseInt(txtCodigo) };
      setListaProductos(nuevosProductos);
    }
    nuevoProduct();
  }

  const eliminarProducto = (id) => {
    const nuevosProductos = listaProductos.filter(producto => producto.id !== id);
    setListaProductos(nuevosProductos);
    setCantidadProductos(nuevosProductos.length);
  }

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.product}>Productos</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={txtCodigo}
          placeholder='Codigo'
          onChangeText={setTxtCodigo}
          keyboardType='numeric'
          editable={esNuevo}
        />
        <TextInput
          style={styles.input}
          value={txtNombre}
          placeholder='Nombre'
          onChangeText={setTxtNombre}
        />
        <TextInput
          style={styles.input}
          value={txtCategoria}
          placeholder='Categoria'
          onChangeText={setTxtCategoria}
        />
        <TextInput
          style={styles.input}
          value={txtPrecioCompra}
          placeholder='Precio de compra'
          onChangeText={setTxtPrecioCompra}
          keyboardType='numeric'
        />
        <TextInput
          style={styles.input}
          value={txtPrecioVenta}
          placeholder='Precio de venta'
          editable={false}
        />
        <View style={styles.botones}>
          <Button
            title='Nuevo'
            onPress={() => {
              nuevoProduct();
            }}
          />
          <Button
            title='Guardar'
            onPress={() => {
              guardarProducto();
            }}
            buttonStyle={styles.btn}
          />
          <Text>Productos: { cantidadProductos }</Text>
        </View>
      </View>

      <View style={styles.list}>
        <FlatList
          data={listaProductos}
          renderItem={(obj) => {
            return <ItemProducto identificador={obj.item.id} producto={obj.item}/>
          }}
          keyExtractor={(item) => {
            return item.id.toString();
          }}
        />
      </View>
      <View style={styles.footer}>
          <Text>&copy; 2024 Hector Ajumado. Todos los derechos reservados.</Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    paddingHorizontal: 15
  },
  btn: {
    backgroundColor:'red',
    width: 100
  },
  title: {
    flex: 1.3,
    justifyContent: 'flex-end',
    paddingBottom: 2,
  },
  form: {
    flex: 5,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: 'gray',
    paddingVertical: 8,
    paddingHorizontal: 10
  },
  input: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginTop: 9,
    borderRadius: 5
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 15
  },
  product: {
    fontWeight: 'bold',
    fontSize: 20
  },
  list: {
    flex: 6,
  },
  item: {
    borderWidth: 1,
    flexDirection: 'row',
    borderColor: 'cadetblue',
    borderRadius: 3,
    backgroundColor: 'aliceblue',
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center'
  },
  codigo: {
    flex: 1,
  },
  name: {
    flex: 4,
    paddingLeft: 6
  },
  category: {
    fontSize: 12,
    fontStyle: 'italic'
  },
  prices: {
    flex: 2.6,
    alignItems: 'flex-end',
    paddingRight: 6
  },
  action: {
    flex: 2.6,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  datos: {
    fontSize:15
  },
  price: {
    fontWeight: 'bold'
  },
  footer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});