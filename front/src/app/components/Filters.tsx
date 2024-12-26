import { ColumnDef, Table } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { Review } from "../types";

export const Filters = ({ table }: { table:  Table<ColumnDef<Review & { delete: string }>> }) => {
    const filters = table.getState().columnFilters;
  
    const getFilterValue = (id: string) => {
      const filter = filters.find((f) => f.id === id);
      return filter ? filter.value : id === "rating" ? [] : "";
    };

    const dropdownRef = useRef<HTMLDivElement>(null);

  
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };
  
    const handleRatingChange = (rating: number) => {
      const currentRatings = getFilterValue("rating") as number[];
      const updatedRatings = currentRatings.includes(rating)
        ? currentRatings.filter((r) => r !== rating) // Remove rating
        : [...currentRatings, rating]; // Add rating
  
      table.setColumnFilters([
        ...filters.filter((f) => f.id !== "rating"),
        { id: "rating", value: updatedRatings },
      ]);
    };

    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
  
    useEffect(() => {
      if (isDropdownOpen) {
        document.addEventListener("mousedown", handleOutsideClick);
      } else {
        document.removeEventListener("mousedown", handleOutsideClick);
      }
  
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }, [isDropdownOpen]);
  
    return (
      <div className="flex items-center space-x-4">
        {/* Author Filter */}
        <input
          type="text"
          name="author"
          placeholder="Filter by author"
          value={getFilterValue("author") as string}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          onChange={(e) =>
            table.setColumnFilters([
              ...filters.filter((f) => f.id !== "author"),
              { id: "author", value: e.target.value },
            ])
          }
        />
  
        {/* Rating Multi-Select Filter */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            onClick={toggleDropdown}
          >
            Select Ratings
          </button>
          {isDropdownOpen && (
            <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-md shadow-md w-40">
              <ul className="p-2 space-y-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <li key={rating} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`rating-${rating}`}
                      value={rating}
                      checked={(getFilterValue("rating") as number[]).includes(rating)}
                      onChange={() => handleRatingChange(rating)}
                      className="mr-2"
                    />
                    <label htmlFor={`rating-${rating}`} className="cursor-pointer">
                      {rating}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };