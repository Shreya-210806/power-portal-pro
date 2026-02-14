import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const RatingWidget = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!user || rating === 0) return;
    setSubmitting(true);
    const { error } = await supabase.from("ratings").insert({
      user_id: user.id,
      rating,
      feedback: feedback || null,
      category: "service",
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Thank you!", description: "Your feedback has been submitted." });
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <Card className="border-border/50">
        <CardContent className="py-8 text-center">
          <div className="flex justify-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-6 h-6 ${s <= rating ? "fill-warning text-warning" : "text-muted"}`} />
            ))}
          </div>
          <p className="font-semibold text-lg">Thanks for your feedback!</p>
          <p className="text-sm text-muted-foreground">Your rating helps us improve.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-warning" />
          Rate Our Service
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  s <= (hover || rating) ? "fill-warning text-warning" : "text-muted-foreground/30"
                }`}
              />
            </button>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground">
          {rating === 0 ? "Tap a star to rate" : `${rating}/5 - ${["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}`}
        </p>
        <Textarea
          placeholder="Any additional feedback? (optional)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={3}
        />
        <Button onClick={handleSubmit} className="w-full" disabled={rating === 0 || submitting}>
          {submitting ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : null}
          Submit Rating
        </Button>
      </CardContent>
    </Card>
  );
};

export default RatingWidget;
