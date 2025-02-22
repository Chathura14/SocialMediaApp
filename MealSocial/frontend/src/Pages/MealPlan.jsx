import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

const MealPlan = ({ user }) => {
  const [mealPlans, setMealPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const res = await axios.get("http://localhost:8080/mealPlans");
        if (res.status === 200) {
          setMealPlans(res.data);
        }
      } catch (error) {
        toast.error("Failed to fetch meal plans");
      }
    };
    fetchMealPlans();
  }, []);

  // Trigger delete modal
  const deleteMealPlan = (mealPlan) => {
    setPlanToDelete(mealPlan); // Set the plan to delete
    setIsModalOpen(true); // Open the modal
  };

  // Confirm delete action
  const confirmDelete = async () => {
    if (planToDelete) {
      try {
        await axios.delete(`http://localhost:8080/mealPlans/${planToDelete.mealPlanId}`);
        setMealPlans((prevMealPlans) =>
          prevMealPlans.filter((mp) => mp.mealPlanId !== planToDelete.mealPlanId)
        );
        toast.success("Meal Plan deleted successfully");
      } catch (error) {
        toast.error("Failed to delete Meal Plan");
      }
    }
    setIsModalOpen(false); // Close the modal after confirmation
  };

  const navigateEditPage = (mealPlan) => {
    navigate(`/CreateMealPlan/${mealPlan.mealPlanId}`);
  };

  return (
    <div className="p-4 min-h-screen bg-cover bg-center" style={{ backgroundColor: `black` }}>
      <div className="space-y-6 max-w-xl mx-auto rounded-lg shadow-md ">
        {mealPlans.map((mealPlan, index) => (
          <div key={index} className="rounded-lg bg-white shadow-md p-4" style={{ border: "2px solid #ff0404" }}>
            <div className="overflow-hidden bg-cover bg-no-repeat mb-2 w-sm h-sm sm:w-sm sm:h-sm">
              <img className="rounded-t-lg w-full h-full" src={mealPlan?.source} alt="" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img src={mealPlan?.userProfile} className="w-10 h-10 rounded-full mr-4" alt="ProfileImage" />
                  <p className="text-md font-medium leading-tight text-neutral-600">{mealPlan?.username}</p>
                </div>
                <p className="text-base text-neutral-600">{mealPlan?.date}</p>
              </div>
              <h6 className="mb-4 text-xl font-bold leading-tight text-neutral-600 underline">
                {mealPlan?.recipes}
              </h6>
              <p className="text-sm text-base text-neutral-500">
                <span className="text-neutral-600 text-xs">Meal Type: </span>{mealPlan?.mealType}
              </p>
              <p className="text-sm text-base text-neutral-500">
                <span className="text-neutral-600 text-xs">Dietary Preferences: </span> {mealPlan?.dietaryPreferences}
              </p>
              <p className="text-sm mb-2 text-base text-neutral-500">
                <span className="text-neutral-600 text-xs">Portion Sizes: </span> {mealPlan?.portionSizes}
              </p>
              <div className="mb-4">
                <h6 className="mb-1 text-lg font-bold leading-tight text-neutral-600">Ingredients</h6>
                <p className="text-base text-neutral-500">{mealPlan?.ingredients}</p>
              </div>
              <div className="mb-4">
                <h6 className="mb-1 text-lg font-bold leading-tight text-neutral-600">Cooking Instruction</h6>
                <p className="text-base text-neutral-500">{mealPlan?.cookingInstruction}</p>
              </div>
              <div className="mb-4">
                <h6 className="text-xl font-medium leading-tight text-neutral-600">Nutritional Information</h6>
                <p className="text-base text-neutral-500">{mealPlan?.nutritionalInformation}</p>
              </div>
              <div className="flex justify-end">
                {user?.id === mealPlan?.userId && (
                  <>
                    <AiFillDelete
                      size={20}
                      color="black"
                      className="cursor-pointer mr-2"
                      onClick={() => deleteMealPlan(mealPlan)}
                    />
                    <AiFillEdit
                      size={20}
                      color="black"
                      className="cursor-pointer"
                      onClick={() => navigateEditPage(mealPlan)}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <h2 className="text-lg font-semibold">Confirm Deletion</h2>
            <p className="mt-2">Are you sure you want to delete this meal plan?</p>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="mr-2 bg-gray-300 px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlan;
