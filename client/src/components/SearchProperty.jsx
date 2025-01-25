"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { ArrowRight, MapPin, Star } from "lucide-react";

const SearchProperty = ({data}) => {
    console.log("object",data)
    const [searchQuery, setSearchQuery] = useState("");
     const [properties, setProperties] = useState([]);
      const [filteredProperties, setFilteredProperties] = useState([]);

    const handleFetch = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/get_property_by_location?location=${data.location}&propertyType=${data.type}`);
          console.log("res.data.data",res.data.data)
          setProperties(res.data.data);
          setFilteredProperties(res.data.data);
        } catch (error) {
          console.log("Internal server error", error);
        }
      };

      React.useEffect(() => {
          handleFetch();
        }, []);
    
    const handleSearch = (query) => {
      setSearchQuery(query);
  
      const keywords = query.toLowerCase().split(" ");
  
      const filtered = properties.filter((property) => {
        const matchesType = keywords.some((keyword) =>
          property.propertyType.name.toLowerCase().includes(keyword)
        );
        const matchesLocation = keywords.some((keyword) =>
          property.location.name.toLowerCase().includes(keyword)
        );
        const matchesTitle = keywords.some((keyword) =>
          property.name.toLowerCase().includes(keyword)
        );
  
        return matchesType || matchesLocation || matchesTitle;
      });
  
      setFilteredProperties(filtered);
    };
  
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-[#004D67] py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
              Find Your Perfect Property
            </h1>
  
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto relative">
              <div className="flex items-center bg-white rounded-full shadow-lg p-2">
                <input
                  type="text"
                  placeholder="Search by type, location, or title..."
                  className="flex-1 px-6 py-3 rounded-full focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <button className="bg-[#004D67] text-white p-3 rounded-full hover:bg-[#003B51] transition-colors">
                  <FaSearch className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
  
        {/* Properties Grid */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
                >
                  <div className="relative">
                    <img
                      src={property.image.url}
                      alt={property?.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-4 left-4">
                      <div className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {property.rating}
                        </span>
                        <span className="text-sm text-gray-600">
                          ({property.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {property?.name}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{property?.location?.name}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Starting from</div>
                        <div className="text-xl font-bold text-blue-600">
                          ₹{property.startingPrice}
                        </div>
                      </div>
                    </div>
  
                    <Link
                      href={`/properties/${property?.slug}`}
                      className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center justify-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-[1.02]"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center col-span-full">
                No properties match your search.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

export default SearchProperty
