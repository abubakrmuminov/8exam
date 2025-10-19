import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase/config";
import { collection, query, where, onSnapshot, deleteDoc, doc, orderBy } from "firebase/firestore";
import RecipeCard from "./RecipeCard";
import RecipeModal from "./RecipeModal";
import { Skeleton } from "./ui/skeleton";
import { toast } from "react-toastify";



export default function RecipesList() {
  const user = useSelector((state) => state.auth.user);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "recipes"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const recipesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setRecipes(recipesData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching recipes:", error);
        toast.error("Failed to load recipes");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;

    try {
      await deleteDoc(doc(db, "recipes", id));
      toast.success("Recipe deleted successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="w-full h-48 rounded-2xl" />
            <Skeleton className="w-3/4 h-6" />
            <Skeleton className="w-1/2 h-4" />
            <div className="flex gap-2">
              <Skeleton className="flex-1 h-10 rounded-xl" />
              <Skeleton className="w-10 h-10 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="py-16 text-center shadow-lg bg-card border rounded-3xl">
        <div className="mb-4 text-6xl">🍽️</div>
        <h3 className="mb-2 text-2xl font-bold text-foreground">No recipes yet</h3>
        <p className="text-muted-foreground">Start by creating your first recipe!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onViewDetails={setSelectedRecipe}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      )}
    </>
  );
}
