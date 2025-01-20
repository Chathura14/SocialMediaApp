import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import CreateBG from "../images/CreateBG.png";
import { useNavigate, useParams } from "react-router-dom";
import { TEInput, TETextarea } from "tw-elements-react";
import { useActiveTab } from "../context/ActiveTabContext";
import axios from "axios";
import toast from "react-hot-toast";

const CreateWorkouStatus = () => {
  const { setActiveTab } = useActiveTab();
  const [distance, setDistance] = useState("");
  const [pushups, setPushups] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [user, setUser] = useState({});
  const [editStatus, setEditStatus] = useState(false);

  const { statusId } = useParams();

  useEffect(() => {
    const fetchSinglePost = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/workoutStatus/${statusId}`
        );
        setWeight(data.weight);
        setDistance(data.distance);
        setPushups(data.pushUps);
        setDescription(data.description);
        setDate(data.date);
        setEditStatus(true);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSinglePost();
  }, [statusId]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      return;
    }

    if (!distance || !pushups || !weight || !description || !date) {
      return toast.error("Please fill all the fields");
    }

    const workoutStatusData = {
      userId: user.id,
      distance,
      pushUps: pushups,
      weight,
      description,
      date,
    };

    const updateWorkoutStatusData = {
      userId: user.id,
      distance,
      pushUps: pushups,
      weight,
      description,
      date,
    };
    if (editStatus) {
      try {
        const res = await axios.put(
          `http://localhost:8080/workoutStatus/${statusId}`,
          updateWorkoutStatusData
        );
        if (res.status === 200) {
          toast.success("Workout status updated successfully");
          setDistance("");
          setPushups("");
          setWeight("");
          setDescription("");
          setDate("");
          navigate("/");
          setActiveTab("tab2");
        }
      } catch (error) {
        toast.error("Failed to update workout status");
      }
    } else {
      try {
        const res = await axios.post(
          "http://localhost:8080/workoutStatus",
          workoutStatusData
        );
        if (res.status === 201) {
          toast.success("Workout status added successfully");
          setDistance("");
          setPushups("");
          setWeight("");
          setDescription("");
          setDate("");
          navigate("/");
          setActiveTab("tab2");
        }
      } catch (error) {
        toast.error("Failed to add workout status");
      }
    }
  };
  const navigate = useNavigate();

  const goToWorkoutStatus = () => {
    navigate("/");
    setActiveTab("tab2");
  };

  return (
    <Layout>
      <div
        className="min-h-screen p-4 bg-cover bg-center"
        // style={{ backgroundImage: `url(${CreateBG})` }}
        style={{ backgroundColor: "black" }}
      >
        
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md"
          style={{ color: "#FF0404" , backgroundColor: "white" }}
        >
          <h1 className="mb-4 text-3xl font-semibold text-center text-red-600">
            {editStatus ? "Edit Workout Status" : "Create Workout Status"}
          </h1>
          <div className="mb-4">
            <TEInput
              type="number"
              label="Distance ran (in km)"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="bg-gray-200 text-gray-700"
            />
          </div>
          <div className="mb-4">
            <TEInput
              type="number"
              label="Number of push-ups"
              value={pushups}
              onChange={(e) => setPushups(e.target.value)}
              className="bg-gray-200 text-gray-700"
            />
          </div>
          <div className="mb-4">
            <TEInput
              type="number"
              label="Weight lifted (in kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="bg-gray-200 text-gray-700"
            />
          </div>
          <div className="relative max-w-sm">
            <TEInput
              type="date"
              label=""
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-gray-200 text-gray-700"
            />
          </div>
          <div className="mb-6">
            <TETextarea
              label="Description of your workout"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="bg-gray-200 text-gray-700"
            />
          </div>
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="w-1/2 py-2 text-sm font-medium text-white bg-yellow-400 rounded-md shadow hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
              style={{ backgroundColor: "#FF0404" }}
            >
              {editStatus ? "Update Status" : "Create Status"}
            </button>
            <button
              onClick={goToWorkoutStatus}
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

export default CreateWorkouStatus;
