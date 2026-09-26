import { useEffect, useState } from "react";
import { Edit, Trash2, X, Plus } from "lucide-react";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  // Create
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Edit
  const [editingProduct, setEditingProduct] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Delete
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Product form
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  });

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/admin/products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch products"
        );
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error("Fetch products error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FORM INPUT
  // =====================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      image: "",
    });
  };

  // =====================================================
  // OPEN CREATE MODAL
  // =====================================================

  const openCreateModal = () => {
    setError("");
    resetForm();
    setShowCreateModal(true);
  };

  // =====================================================
  // CLOSE CREATE MODAL
  // =====================================================

  const closeCreateModal = () => {
    if (creating) {
      return;
    }

    setShowCreateModal(false);
    resetForm();
    setError("");
  };

  // =====================================================
  // CREATE PRODUCT
  // =====================================================

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      setCreating(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/admin/products",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: formData.name.trim(),
            description: formData.description.trim(),
            price: Number(formData.price),
            category: formData.category.trim(),
            stock: Number(formData.stock),
            image: formData.image.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create product"
        );
      }

      if (!data.product) {
        throw new Error(
          "Product was created but no product data was returned"
        );
      }

      setProducts((previous) => [
        data.product,
        ...previous,
      ]);

      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error("Create product error:", error);
      setError(error.message);
    } finally {
      setCreating(false);
    }
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const handleEdit = (product) => {
    setError("");

    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      category: product.category || "",
      stock: product.stock ?? "",
      image: product.image || "",
    });
  };

  // =====================================================
  // CLOSE EDIT MODAL
  // =====================================================

  const closeEditModal = () => {
    if (updating) {
      return;
    }

    setEditingProduct(null);
    resetForm();
    setError("");
  };

  // =====================================================
  // UPDATE PRODUCT
  // =====================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingProduct) {
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/admin/products/${editingProduct._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: formData.name.trim(),
            description: formData.description.trim(),
            price: Number(formData.price),
            category: formData.category.trim(),
            stock: Number(formData.stock),
            image: formData.image.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update product"
        );
      }

      if (!data.product) {
        throw new Error(
          "Product was updated but no product data was returned"
        );
      }

      setProducts((previous) =>
        previous.map((product) =>
          product._id === editingProduct._id
            ? data.product
            : product
        )
      );

      setEditingProduct(null);
      resetForm();
    } catch (error) {
      console.error("Update product error:", error);
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const handleDelete = async () => {
    if (!deleteProduct) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/admin/products/${deleteProduct._id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete product"
        );
      }

      setProducts((previous) =>
        previous.filter(
          (product) =>
            product._id !== deleteProduct._id
        )
      );

      setDeleteProduct(null);
    } catch (error) {
      console.error("Delete product error:", error);
      setError(error.message);
    } finally {
      setDeleting(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="text-sm text-gray-500">
        Loading products...
      </div>
    );
  }

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = [
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ];

  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const filteredProducts = products.filter((product) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      product.name
        ?.toLowerCase()
        .includes(searchText) ||
      product.description
        ?.toLowerCase()
        .includes(searchText);

    const matchesCategory =
      category === "all" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div>

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold text-[#14245c]">
            Products
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage your store products.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-lg bg-[#14245c] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1d327a]"
        >
          <Plus size={17} />
          Add Product
        </button>

      </div>

      {/* =================================================
          PAGE ERROR
      ================================================= */}

      {error &&
        !editingProduct &&
        !deleteProduct &&
        !showCreateModal && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

      {/* =================================================
          PRODUCT TABLE CARD
      ================================================= */}

      <div className="rounded-xl border border-gray-200 bg-white p-5">

        {/* SEARCH + CATEGORY */}

        <div className="mb-4 flex flex-col gap-3 md:flex-row">

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search products..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#14245c]"
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#14245c]"
          >
            <option value="all">
              All Categories
            </option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

        </div>

        {/* RESULT COUNT */}

        <p className="mb-3 text-sm text-gray-500">
          Showing {filteredProducts.length} of{" "}
          {products.length} products
        </p>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="max-h-[600px] overflow-auto rounded-lg border border-gray-200">

          <table className="w-full min-w-[950px] text-left text-sm">

            <thead className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50">

              <tr>

                <th className="px-5 py-4 font-semibold text-gray-700">
                  Product
                </th>

                <th className="px-5 py-4 font-semibold text-gray-700">
                  Category
                </th>

                <th className="px-5 py-4 font-semibold text-gray-700">
                  Price
                </th>

                <th className="px-5 py-4 font-semibold text-gray-700">
                  Stock
                </th>

                <th className="px-5 py-4 text-right font-semibold text-gray-700">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-100">

              {filteredProducts.map((product) => (

                <tr
                  key={product._id}
                  className="hover:bg-gray-50"
                >

                  {/* PRODUCT */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg border border-gray-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                          No image
                        </div>
                      )}

                      <div>

                        <p className="font-medium text-gray-800">
                          {product.name}
                        </p>

                        <p className="mt-1 max-w-[300px] truncate text-xs text-gray-400">
                          {product.description}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* CATEGORY */}

                  <td className="px-5 py-4 text-gray-600">
                    {product.category}
                  </td>

                  {/* PRICE */}

                  <td className="px-5 py-4 font-medium text-gray-800">
                    ₹{product.price}
                  </td>

                  {/* STOCK */}

                  <td className="px-5 py-4 text-gray-600">
                    {product.stock}
                  </td>

                  {/* ACTION */}

                  <td className="px-5 py-4">

                    <div className="flex justify-end gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(product)
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-[#3473d8] px-3 py-2 text-xs font-medium text-white hover:bg-[#1d327a]"
                      >
                        <Edit size={15} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setError("");
                          setDeleteProduct(product);
                        }}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white hover:bg-red-700"
                      >
                        <Trash2 size={15} />
                        
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {filteredProducts.length === 0 && (
            <div className="p-8 text-center text-sm text-gray-500">
              No products found.
            </div>
          )}

        </div>

      </div>

      {/* =================================================
          CREATE PRODUCT MODAL
      ================================================= */}

      {showCreateModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">

              <div>

                <h3 className="text-lg font-semibold text-[#14245c]">
                  Add Product
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Add a new product to your store
                </p>

              </div>

              <button
                type="button"
                onClick={closeCreateModal}
                disabled={creating}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
              >
                <X size={20} />
              </button>

            </div>

            {/* CREATE FORM */}

            <form
              onSubmit={handleCreate}
              className="max-h-[75vh] overflow-y-auto p-6"
            >

              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">

                {/* NAME */}

                <div className="md:col-span-2">

                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Product Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter product name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#14245c]"
                  />

                </div>

                {/* DESCRIPTION */}

                <div className="md:col-span-2">

                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                    placeholder="Enter product description"
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#14245c]"
                  />

                </div>

                {/* PRICE */}

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    required
                    placeholder="0"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#14245c]"
                  />

                </div>

                {/* STOCK */}

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    required
                    placeholder="0"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#14245c]"
                  />

                </div>

                {/* CATEGORY */}

                <div className="md:col-span-2">

                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Smartphones"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#14245c]"
                  />

                </div>

                {/* IMAGE URL */}

                <div className="md:col-span-2">

                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Image URL
                  </label>

                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter image URL"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#14245c]"
                  />

                  <p className="mt-1.5 text-xs text-gray-400">
                    Paste the URL of the product image.
                  </p>

                </div>

              </div>

              {/* CREATE BUTTONS */}

              <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5">

                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={creating}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-lg bg-[#14245c] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1d327a] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating
                    ? "Creating..."
                    : "Create Product"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =================================================
          EDIT PRODUCT MODAL
      ================================================= */}

      {editingProduct && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">

              <div>

                <h3 className="text-lg font-semibold text-[#14245c]">
                  Edit Product
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Update product information
                </p>

              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={updating}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
              >
                <X size={20} />
              </button>

            </div>

            {/* EDIT FORM */}

            <form
              onSubmit={handleUpdate}
              className="max-h-[75vh] overflow-y-auto p-6"
            >

              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">

                {/* NAME */}

                <div className="md:col-span-2">

                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Product Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#14245c]"
                  />

                </div>

                {/* DESCRIPTION */}

                <div className="md:col-span-2">

                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#14245c]"
                  />

                </div>

                {/* PRICE */}

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#14245c]"
                  />

                </div>

                {/* STOCK */}

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#14245c]"
                  />

                </div>

                {/* CATEGORY */}

                <div className="md:col-span-2">

                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#14245c]"
                  />

                </div>

                {/* IMAGE URL */}

                <div className="md:col-span-2">

                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Image URL
                  </label>

                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter image URL"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#14245c]"
                  />

                  <p className="mt-1.5 text-xs text-gray-400">
                    Paste the URL of the product image.
                  </p>

                </div>

              </div>

              {/* EDIT BUTTONS */}

              <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5">

                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={updating}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="rounded-lg bg-[#14245c] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1d327a] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updating
                    ? "Updating..."
                    : "Update Product"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =================================================
          DELETE CONFIRMATION MODAL
      ================================================= */}

      {deleteProduct && (

        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100">

                <Trash2
                  size={22}
                  className="text-red-600"
                />

              </div>

              <div>

                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Product
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Are you sure you want to delete{" "}
                  <span className="font-medium text-gray-700">
                    {deleteProduct.name}
                  </span>
                  ?
                </p>

                <p className="mt-2 text-xs text-red-500">
                  This action cannot be undone.
                </p>

              </div>

            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={() => {
                  if (!deleting) {
                    setDeleteProduct(null);
                    setError("");
                  }
                }}
                disabled={deleting}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Product"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminProducts;