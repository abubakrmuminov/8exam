import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, Eye, Trash2 } from "lucide-react";



export default function RecipeCard({ recipe, onViewDetails, onDelete }) {
  const defaultImage = "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800";
  const firstPhoto = recipe.photoURLs?.[0] || defaultImage;

  return (
    <Card className="overflow-hidden transition-all duration-300 shadow-lg group rounded-3xl hover:shadow-xl hover:border-orange-500/20">
      <div className="relative h-48 overflow-hidden">
        <img
          src={firstPhoto}
          alt={recipe.name}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
        />
        <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:opacity-100" />
      </div>

      <CardContent className="p-5">
        <h3 className="mb-2 text-xl font-bold text-foreground line-clamp-1">
          {recipe.name}
        </h3>

        <div className="flex items-center mb-4 text-sm text-muted-foreground">
          <Clock className="w-4 h-4 mr-1" />
          <span>{recipe.cookingTime}</span>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => onViewDetails(recipe)}
            className="flex-1 transition-all shadow-lg rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-orange-500/20 hover:shadow-orange-500/30"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          <Button
            onClick={() => onDelete(recipe.id)}
            variant="outline"
            className="transition-all rounded-2xl hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
