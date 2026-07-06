import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../../../shared/lib/apiClient";
import ShopForm from "../components/ShopForm";

function CreateShop() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", description: "", contact: "", category: "" });
  const [error, setError] = useState("");

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const data = await request("/api/shop", {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (data.success) {
        // shop created → go to “my shops” list
        navigate("/shops");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return <ShopForm/>
}

export default CreateShop;
