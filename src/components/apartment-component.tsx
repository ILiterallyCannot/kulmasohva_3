import React, { useState, useEffect, ChangeEvent } from "react";
import IApartment from "../types/apartment-type";
import ApartmentService from "../services/apartment-service";

const ApartmentComponent: React.FC = () => {
  const [apartments, setApartments] = useState<IApartment[]>([]);
  const [formData, setFormData] = useState({
    price: "",
    description: "",
    size: "",
    address: "",
    city: "",
    country: "",
  });

  useEffect(() => {
    loadApartments();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      const apartmentContent: IApartment = {
        price: formData.price,
        size: formData.size,
        address: formData.address,
        description: formData.description,
        city: formData.city,
        country: formData.country,
      };
      await ApartmentService.listApartment(apartmentContent);
      console.log("Apartment listed!");
      loadApartments();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const loadApartments = () => {
    ApartmentService.getAllApartments().then(
      (response) => {
        setApartments(response.data);
      },
      (error) => {
        console.error('Error fetching apartments:', error);
      }
    );
  };

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>Apartments for Rent</h3>
      </header>
      <h4>List an apartment</h4>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="price"
            />
            <input
              type="textbox"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="description"
            />
            <input
              type="number"
              name="size"
              value={formData.size}
              onChange={handleChange}
              placeholder="size"
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="address"
            />
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="city"
            />
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="country"
            />
            <button type="submit">Post apartment!</button>
          </form>
      <ul>
        {apartments.map((apartment) => (
          <li key={apartment.id}>
            <p>{apartment.size}</p>
            <p>{apartment.address}</p>
            <p>{apartment.city}</p>
            <p>{apartment.country}</p>
            <p>{apartment.price}</p>
            <p>{apartment.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApartmentComponent;
