import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      name: '',
      price: '',
      category: '',
      editingId: null
    };
  }

  componentDidMount() {
    this.fetchProducts();
  }

  fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/products');
      this.setState({ products: res.data });
    } catch (err) {
      console.error(err);
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { name, price, category, editingId } = this.state;
    if (!name || !price || !category) return;

    const data = { name, price: Number(price), category };

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:8000/api/products/${editingId}`,
          data
        );
      } else {
        await axios.post('http://localhost:8000/api/products', data);
      }

      this.setState({
        name: '',
        price: '',
        category: '',
        editingId: null
      });

      this.fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  handleEdit = (product) => {
    this.setState({
      name: product.name,
      price: product.price,
      category: product.category,
      editingId: product._id
    });
  };

  handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/products/${id}`);
      this.fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const { products, name, price, category, editingId } = this.state;

    return (
      <div className="container">
        <h1>Product Management</h1>

        <form className="form" onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={this.handleChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={price}
            onChange={this.handleChange}
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={category}
            onChange={this.handleChange}
          />
          <button type="submit">
            {editingId ? 'Update' : 'Add Product'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() =>
                this.setState({
                  name: '',
                  price: '',
                  category: '',
                  editingId: null
                })
              }
            >
              Cancel
            </button>
          )}
        </form>

        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price (LKR)</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan="4" className="empty-row">
                  No products yet. Add one above.
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.category}</td>
                <td>
                  <button onClick={() => this.handleEdit(p)}>Edit</button>
                  <button onClick={() => this.handleDelete(p._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;