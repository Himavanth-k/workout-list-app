
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [exercises, setExercises] = useState([]);
  const [muscle, setMuscle] = useState("All");
  const [category, setCategory] = useState("All");
  const [equipment, setEquipment] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json"
    )
      .then((response) => response.json())
      .then((data) => {
        setExercises(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const muscles = [
    "All",
    ...new Set(exercises.flatMap((exercise) => exercise.primaryMuscles || [])),
  ];

  const categories = [
    "All",
    ...new Set(exercises.map((exercise) => exercise.category).filter(Boolean)),
  ];

  const equipments = [
    "All",
    ...new Set(exercises.map((exercise) => exercise.equipment).filter(Boolean)),
  ];

  const filteredExercises = exercises.filter((exercise) => {
    const muscleMatch =
      muscle === "All" || (exercise.primaryMuscles || []).includes(muscle);

    const categoryMatch =
      category === "All" || exercise.category === category;

    const equipmentMatch =
      equipment === "All" || exercise.equipment === equipment;

    return muscleMatch && categoryMatch && equipmentMatch;
  });

  const resetFilters = () => {
    setMuscle("All");
    setCategory("All");
    setEquipment("All");
  };

  if (loading) {
    return <h2 className="loading">Loading exercises...</h2>;
  }

  return (
    <div className="container">
      <h1>Exercise Library</h1>

      <div className="filters">
        <div className="filter">
          <label>Muscle</label>
          <select value={muscle} onChange={(e) => setMuscle(e.target.value)}>
            {muscles.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="filter">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="filter">
          <label>Equipment</label>
          <select
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
          >
            {equipments.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <button className="reset-btn" onClick={resetFilters}>
          Reset Filters
        </button>
      </div>

      <p className="result-count">
        Showing {filteredExercises.length} exercises
      </p>

      <div className="exercise-grid">
        {filteredExercises.map((exercise) => (
          <div className="exercise-card" key={exercise.id}>
            {exercise.images && exercise.images.length > 0 ? (
              <img
                src={`https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${exercise.images[0]}`}
                alt={exercise.name}
              />
            ) : (
              <div className="no-image">No image available</div>
            )}

            <h3>{exercise.name}</h3>

            <p>
              <strong>Muscle:</strong>{" "}
              {(exercise.primaryMuscles || []).join(", ") || "N/A"}
            </p>

            <p>
              <strong>Category:</strong> {exercise.category || "N/A"}
            </p>

            <p>
              <strong>Equipment:</strong> {exercise.equipment || "N/A"}
            </p>

            <p>
              <strong>Level:</strong> {exercise.level || "N/A"}
            </p>
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <h2 className="no-results">No exercises found.</h2>
      )}
    </div>
  );
}

export default App;
