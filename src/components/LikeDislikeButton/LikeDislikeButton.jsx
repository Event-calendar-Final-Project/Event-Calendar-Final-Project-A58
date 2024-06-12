import React, { useState } from 'react';
import PropTypes from 'prop-types';

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
      <button onClick={handleLike} className={`btn btn-xs min-w-auto w-14 h-14 bg-orange-300 p-2 rounded-full hover:bg-orange-500 text-white font-semibold transition-rotation duration-300 hover:rotate-45 ease-in-out ${liked ? 'btn-accent' : 'btn-outline btn-secondary'}`}>
        {liked ? 'Dislike' : 'Like'}
      </button>
      <span>{`Likes: ${likes}`}</span>
    </div>
  );
}

LikeDislikeButton.propTypes = {
  initialLikes: PropTypes.number.isRequired,
  onLike: PropTypes.func.isRequired,
  onDislike: PropTypes.func.isRequired,
};