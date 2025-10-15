import AddProduct from './AddProduct';
import ProductList from './ProductList';
import Cart from './Cart';

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Shopping App</h1>
      <AddProduct />
      <ProductList />
      <Cart /> {/* ✅ Show cart below products */}
    </div>
  );
}

export default App;
