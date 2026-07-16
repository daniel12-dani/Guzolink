import { useState } from "react";
import { useAuth } from "../auth.context";
import { useNavigate } from "react-router-dom";
import UpdateUserCard from "../components/UpdateUserCard.jsx";

function UpdateUserInfo() {
  const [formData, setFormData] = useState({
    username: "",
    countryCode: "+251",
    phone: "",
    address: "",
    profileImage: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await updateUser(
      formData.username,
      formData.countryCode + formData.phone,
      formData.address,
      formData.profileImage,
    );
    setLoading(false);

    if (result.success) {
      // TODO: create profile button on the nav bar clickable and takes to the profile page
      // force the user to logout and login and if the user changed their email we have to make sure they request confirmation
      logout();
      navigate("/login");
      return;
    }
    setError(result.message || "Unable to update your account.");
  };
  return (
    <UpdateUserCard
      formData={formData}
      loading={loading}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      error={error}
    />
  );
}

export default UpdateUserInfo;
