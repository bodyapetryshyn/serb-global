'use client';

import React, { useEffect, useState } from 'react';
import { useReactTable, createColumnHelper, flexRender, getCoreRowModel } from '@tanstack/react-table';
import { createProduct, deleteProduct, fetchProducts, updateProduct } from './reducer/reducer';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';


interface ProductItem {
  id: number,
  title: string,
  description: string,
  brand: string,
  category: string,
  price: string,
  actions?: any
}

function Home() {
  const dispatch = useDispatch();
  let createProductCheck = true
  const products = useSelector((state: any) => state.products.data);

  useEffect(() => {
    dispatch(fetchProducts() as any);
  }, [dispatch]);

  const helper = createColumnHelper<ProductItem>();

  const deleteProductHandler = (id: number) => {
    dispatch(deleteProduct(id) as any);
  };

  const updateProductHandler = (product: ProductItem) => {
    setIsModalOpen(true)
    setFormData(product)
    createProductCheck = false
  };

  const cancelOperation = () => {
    setIsModalOpen(false)
    setFormData({ title: '', brand: '', category: '', description: '', price: '' });
    createProductCheck = true
  }

  const columns = [
    helper.accessor('title', { header: 'Title' }),
    helper.accessor('description', { header: 'Description' }),
    helper.accessor('brand', { header: 'Brand' }),
    helper.accessor('category', { header: 'Category' }),
    helper.accessor('price', { header: 'Price' }),
    helper.accessor('actions', {
      header: 'Actions',
      cell: info => (
        <>
          <button className='updateButton' onClick={() => updateProductHandler(info.row.original)}>Update</button>
          <button className='deleteButton' onClick={() => deleteProductHandler(info.row.original.id)}>Delete</button>
        </>
      ),
    }),
  ];

  const table = useReactTable<ProductItem>({
    columns,
    data: products,
    getCoreRowModel: getCoreRowModel(),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    category: '',
    description: '',
    price: '',
  });

  const [formErrors, setFormErrors] = useState({} as any);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createProductCheck ? createPost() : updatePost()
  };

  const validateForm = () => {
    const errors: any = {};
    if (!formData.title) errors.title = 'Title is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.brand) errors.brand = 'Brand is required';
    if (!formData.price) errors.price = 'Price is required';

    return errors;
  };
  const createPost = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    dispatch(createProduct(formData) as any);
    cancelOperation()
  };

  const updatePost = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    dispatch(updateProduct(formData) as any);
    cancelOperation()
  };

  return (
    <>
      <button className="button" onClick={() => setIsModalOpen(true)}>Create Post</button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => cancelOperation()}
        contentLabel="Create Post"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '40%',
            height: '500px',
            border: '1px solid #ccc',
            background: '#fff',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            borderRadius: '4px',
            outline: 'none',
            padding: '20px',
          },
        }}
      >
        <form onSubmit={handleSubmit} className="form-container">
          <div>
            <label className="form-label">Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-input"
            />
            {formErrors.title && <span className="error-message">{formErrors.title}</span>}
          </div>
          <div>
            <label className="form-label">Description:</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-input"
            />
            {formErrors.description && <span className="error-message">{formErrors.description}</span>}
          </div>
          <div>
            <label className="form-label">Category:</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="form-input"
            />
            {formErrors.category && <span className="error-message">{formErrors.category}</span>}
          </div>
          <div>
            <label className="form-label">Brand:</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className="form-input"
            />
            {formErrors.brand && <span className="error-message">{formErrors.brand}</span>}
          </div>
          <div>
            <label className="form-label">Price:</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="form-input"
            />
            {formErrors.price && <span className="error-message">{formErrors.price}</span>}
          </div>
          <button type="submit" className="button">Submit</button>
          <button type="button" className="button cancel-button" onClick={() => cancelOperation()}>Cancel</button>
        </form>
      </Modal>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(column => (
                <th key={column.id}>{flexRender(column.column.columnDef.header, column.getContext())}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Home;
