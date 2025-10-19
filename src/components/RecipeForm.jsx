import { useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { X, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";



export default function RecipeForm({ onClose }) {
  const user = useSelector((state) => state.auth.user);
  const [recipeName, setRecipeName] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [photoURLs, setPhotoURLs] = useState([]);
  const [photoInput, setPhotoInput] = useState("");
  const [method, setMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addIngredient = () => {
    if (ingredientInput.trim()) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput("");
    }
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addPhoto = () => {
    if (photoInput.trim()) {
      setPhotoURLs([...photoURLs, photoInput.trim()]);
      setPhotoInput("");
    }
  };

  const removePhoto = (index) => {
    setPhotoURLs(photoURLs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recipeName.trim() || !cookingTime.trim() || ingredients.length === 0 || !method.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "recipes"), {
        name: recipeName,
        cookingTime,
        ingredients,
        photoURLs,
        method,
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL || user.photoUrl,
        createdAt: serverTimestamp(),
      });

      toast.success("Recipe created successfully!");
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-2xl my-8 shadow-xl rounded-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <CardTitle className="text-2xl font-bold">Create New Recipe</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="transition-all rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="recipeName">Recipe Name *</Label>
              <Input
                id="recipeName"
                type="text"
                placeholder="e.g., Chocolate Chip Cookies"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                className="rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cookingTime">Cooking Time *</Label>
              <Input
                id="cookingTime"
                type="text"
                placeholder="e.g., 30 minutes"
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                className="rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Ingredients *</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Add an ingredient"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addIngredient())}
                  className="flex-1 rounded-xl"
                />
                <Button
                  type="button"
                  onClick={addIngredient}
                  className="shadow-lg bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl hover:from-orange-600 hover:to-amber-700 shadow-orange-500/20"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {ingredients.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {ingredients.map((ing, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-3 border bg-muted/30 rounded-2xl"
                    >
                      <span className="text-sm">{ing}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeIngredient(index)}
                        className="rounded-lg hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-2">
              <Label>Photo URLs</Label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={photoInput}
                  onChange={(e) => setPhotoInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPhoto())}
                  className="flex-1 rounded-xl"
                />
                <Button
                  type="button"
                  onClick={addPhoto}
                  className="shadow-lg bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl hover:from-orange-600 hover:to-amber-700 shadow-orange-500/20"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {photoURLs.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {photoURLs.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Recipe photo ${index + 1}`}
                        className="object-cover w-full h-32 border rounded-2xl"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePhoto(index)}
                        className="absolute text-white transition-opacity bg-red-500 rounded-lg shadow-lg opacity-0 top-2 right-2 hover:bg-red-600 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Cooking Method *</Label>
              <Textarea
                id="method"
                placeholder="Describe the cooking steps..."
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="rounded-xl min-h-[150px]"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-2xl"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 shadow-lg rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-orange-500/25 hover:shadow-orange-500/40"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Recipe"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
