import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { X, Clock } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";



export default function RecipeModal({ recipe, onClose }) {
  const defaultImage = "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800";
  const photos = recipe.photoURLs?.length > 0 ? recipe.photoURLs : [defaultImage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-4xl my-8 shadow-xl rounded-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-start justify-between pb-4 border-b">
          <div className="flex-1 pr-4">
            <CardTitle className="mb-2 text-3xl font-bold">
              {recipe.name}
            </CardTitle>
            <div className="flex items-center text-muted-foreground">
              <Clock className="w-5 h-5 mr-2" />
              <span className="text-lg">{recipe.cookingTime}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="flex-shrink-0 transition-all rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="pt-6 space-y-8">
          {photos.length > 0 && (
            <div className="w-full">
              {photos.length === 1 ? (
                <img
                  src={photos[0]}
                  alt={recipe.name}
                  className="object-cover w-full border shadow-lg h-96 rounded-3xl"
                  onError={(e) => {
                    e.currentTarget.src = defaultImage;
                  }}
                />
              ) : (
                <Carousel className="w-full">
                  <CarouselContent>
                    {photos.map((url, index) => (
                      <CarouselItem key={index}>
                        <img
                          src={url}
                          alt={`${recipe.name} - Photo ${index + 1}`}
                          className="object-cover w-full border shadow-lg h-96 rounded-3xl"
                          onError={(e) => {
                            e.currentTarget.src = defaultImage;
                          }}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </Carousel>
              )}
            </div>
          )}

          <div>
            <h3 className="mb-4 text-2xl font-bold">Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-start p-3 border bg-gradient-to-r from-orange-500/10 to-amber-600/10 border-orange-500/20 rounded-2xl"
                >
                  <span className="inline-block w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white text-sm flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 shadow-lg shadow-orange-500/30">
                    {index + 1}
                  </span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-2xl font-bold">Cooking Method</h3>
            <div className="p-6 border bg-muted/30 rounded-3xl">
              <p className="leading-relaxed whitespace-pre-wrap">
                {recipe.method}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
