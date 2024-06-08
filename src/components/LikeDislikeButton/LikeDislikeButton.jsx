import React, { useState } from 'react';

export default function LikeDislikeButton({ initialLikes, onLike, onDislike }) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
      onDislike();
    } else {
      setLikes(likes + 1);
      onLike();
    }
    setLiked(!liked);
  };

  return (
    <div className="flex items-center gap-2">
      <button onClick={handleLike} className={`btn btn-xs ${liked ? 'btn-accent' : 'btn-outline btn-secondary'}`}>
        {liked ? 'Dislike' : 'Like'}
      </button>
      <span>{`Likes: ${likes}`}</span>
    </div>
  );
}