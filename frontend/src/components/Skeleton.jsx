import React from 'react';

export const SkeletonCard = () => (
  <div className="doc-card-v2 skeleton-pulse">
    <div className="doc-top">
      <div className="doc-icon-box skeleton-bg"></div>
      <div className="doc-more skeleton-bg w-4 h-4"></div>
    </div>
    <div className="doc-info">
      <div className="skeleton-line w-3/4 mb-2"></div>
      <div className="skeleton-line w-1/2"></div>
    </div>
    <div className="doc-footer">
      <div className="avatar-stack">
        <div className="tag-dot skeleton-bg"></div>
        <div className="tag-dot skeleton-bg"></div>
      </div>
      <div className="skeleton-line w-12 h-3 ml-auto"></div>
    </div>
  </div>
);

export const SkeletonList = ({ count = 3 }) => (
  <>
    {Array(count).fill(0).map((_, i) => <SkeletonCard key={i} />)}
  </>
);
