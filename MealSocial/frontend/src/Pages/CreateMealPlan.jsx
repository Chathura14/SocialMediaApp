import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import CreateBG from "../images/CreateBG.png";
import { useNavigate, useParams } from "react-router-dom";
import { TEInput, TETextarea } from "tw-elements-react";
import { useActiveTab } from "../context/ActiveTabContext";
import axios from "axios";
import toast from "react-hot-toast";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from "../db/firebase";

const storage = getStorage(app);

const CreateMealPlan = () => {
  const [selectedMealType, setSelectedMealType] = useState("breakfast");
  const [selectedDietaryPreference, setSelectedDietaryPreference] =
    useState("vegan");
  const [recipes, setRecipes] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [cookingInstruction, setCookingInstruction] = useState("");
  const [nutritionalInformation, setNutritionalInformation] = useState("");
  const [portionSizes, setPortionSizes] = useState("");
  const [image, setImage] = useState(null);
  const [date, setDate] = useState("");
  const [user, setUser] = useState({});
  const [editMealPlans, setEditMealPlans] = useState(false);
  const [source, setSource] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setActiveTab } = useActiveTab();

  const { mealPlanId } = useParams();

  const onImageChange = (e) => {
    const selectedFiles = e.target.files;

    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error("Please select at least one image");
    }

    const currentFile = selectedFiles[0];
    setImage(currentFile);
  };

  useEffect(() => {
    const fetchSingleMealPlan = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/mealPlans/${mealPlanId}`
        );
        setRecipes(data.recipes);
        setIngredients(data.ingredients);
        setCookingInstruction(data.cookingInstruction);
        setNutritionalInformation(data.nutritionalInformation);
        setPortionSizes(data.portionSizes);
        setSource(data.source);
        setDate(data.date);
        console.log(data);
        setEditMealPlans(true);
        setSelectedMealType(data.mealType);
        setSelectedDietaryPreference(data.dietaryPreferences);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleMealPlan();
  }, [mealPlanId]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!user) {
      return;
    }

    if (
      !selectedMealType ||
      !selectedDietaryPreference ||
      !recipes ||
      !ingredients ||
      !cookingInstruction ||
      !nutritionalInformation ||
      !portionSizes ||
      !date
    ) {
      setIsLoading(false);
      return toast.error("Please fill all the fields");
    }

    if (!image && !source) {
      setIsLoading(false);
      return toast.error("Please upload an image");
    }

    let imageUrl = null;

    if (image) {
      const imageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    const mealPlanData = {
      userId: user.id,
      mealType: selectedMealType,
      dietaryPreferences: selectedDietaryPreference,
      recipes,
      ingredients,
      cookingInstruction,
      nutritionalInformation,
      portionSizes,
      source: imageUrl,
      date,
    };

    const updateMealPlanData = {
      userId: user.id,
      mealType: selectedMealType,
      dietaryPreferences: selectedDietaryPreference,
      recipes,
      ingredients,
      cookingInstruction,
      nutritionalInformation,
      portionSizes,
      source: imageUrl ? imageUrl : source,
      date,
    };

    console.log(mealPlanData);

    if (editMealPlans) {
      try {
        const res = await axios.put(
          `http://localhost:8080/mealPlans/update/${mealPlanId}`,
          updateMealPlanData
        );
        if (res.status === 200) {
          toast.success("Meal Plans Updated Successfully");
          setRecipes("");
          setSelectedMealType("");
          setSelectedDietaryPreference("");
          setIngredients("");
          setCookingInstruction("");
          setNutritionalInformation("");
          setPortionSizes("");
          setSource("");
          setDate("");
          navigate("/");
          setActiveTab("tab4");
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error("Failed to update workout plans");
      }
    } else {
      try {
        const res = await axios.post(
          `http://localhost:8080/mealPlans/add`,
          mealPlanData
        );
        if (res.status === 201) {
          toast.success("Meal Plans added Successfully");
          setRecipes("");
          setSelectedMealType("");
          setSelectedDietaryPreference("");
          setIngredients("");
          setCookingInstruction("");
          setNutritionalInformation("");
          setPortionSizes("");
          setSource("");
          setDate("");
          navigate("/");
          setActiveTab("tab4");
        }
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to add meal plans");
        setIsLoading(false);
      }
    }
  };

  const navigate = useNavigate();

  const goToMealPlans = () => {
    navigate("/");
  };

  return (
    <Layout>
      <div
        className="min-h-screen p-4 bg-cover bg-center"
        // style={{ backgroundImage: `url(${CreateBG})` }}
        style={{ backgroundColor: "black" }}
      >
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md" style={{ color: "#FF0404" }}>
          <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400-123">
            {editMealPlans ? "Edit Meal Plan" : "Add Meal Plan"}
          </h1>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <div className="relative">
                <label
                  htmlFor="mealType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Meal Type
                </label>
                <select
                  name="mealType"
                  className="border rounded h-10 w-full p-2 mt-2 bg-gray-200 text-gray-700"
                  value={selectedMealType}
                  onChange={(e) => setSelectedMealType(e.target.value)}
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              <div className="relative mt-4">
                <label
                  htmlFor="dietaryPreferences"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Dietary Preferences
                </label>
                <select
                  name="dietaryPreferences"
                  className="border rounded h-10 w-full p-2 mt-2 bg-gray-200 text-gray-700"
                  value={selectedDietaryPreference}
                  onChange={(e) =>
                    setSelectedDietaryPreference(e.target.value)
                  }
                >
                  <option value="vegan">Vegan</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="keto">Keto</option>
                  <option value="gluten-free">Gluten-Free</option>
                </select>
              </div>
            </div>
            <div className="col-span-1">
              <TEInput
                type="text"
                label="Recipes Name"
                className="my-4 bg-gray-200 text-gray-700"
                value={recipes}
                onChange={(e) => setRecipes(e.target.value)}
              />

              <TETextarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="my-4 bg-gray-200 text-gray-700"
                id="ingredients"
                label="Ingredients"
                rows={3}
              />

              <TETextarea
                value={cookingInstruction}
                onChange={(e) => setCookingInstruction(e.target.value)}
                className="my-4 bg-gray-200 text-gray-700"
                id="cooking-instruction"
                label="Cooking Instruction"
                rows={4}
              />

              <TETextarea
                value={nutritionalInformation}
                onChange={(e) => setNutritionalInformation(e.target.value)}
                className="my-4 bg-gray-200 text-gray-700"
                id="nutritional-info"
                label="Nutritional Information"
                rows={2}
              />

              <TEInput
                type="number"
                label="Portion Sizes (g - gram)"
                className="my-4 bg-gray-200 text-gray-700"
                value={portionSizes}
                onChange={(e) => setPortionSizes(e.target.value)}
              />

              <div className="mb-4">
                <label
                  htmlFor="formFile"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload picture of your meal
                </label>
                <input
                  className="relative block w-full px-3 py-2 text-sm font-medium bg-gray-200 text-gray-700 border border-solid border-gray-300 rounded focus:outline-none focus:border-yellow-400"
                  type="file"
                  id="formFile"
                  onChange={onImageChange}
                />
              </div>

              <TEInput
                type="date"
                className="my-4 text-gray-700"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              {image && (
                <img
                  src={URL.createObjectURL(image)}
                  alt="meal"
                  className="w-40 h-40 mb-4"
                />
              )}

              {!image && source && (
                <img src={source} alt="meal" className="w-40 h-40 mb-4" />
              )}
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="w-1/2 py-2 text-sm font-medium text-white bg-yellow-400 rounded-md shadow hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
              style={{ backgroundColor: "#FF0404" }}
            >
              {isLoading ? "Loading..." : editMealPlans ? "Update" : "Create"}
            </button>

            <button
              onClick={goToMealPlans}
              className="w-1/2 py-2 text-sm font-medium text-black bg-transparent border border-solid border-yellow-400 rounded-md shadow hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              style={{ color: "#FF0404", borderColor: "#FF0404" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateMealPlan;
