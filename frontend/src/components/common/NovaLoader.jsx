import React from 'react';
import { motion } from 'framer-motion';

const NovaLoader = ({ variant = 'thinking', text = 'Processing...' }) => {
  const renderLoader = () => {
    switch (variant) {
      case 'scanning':
        return (
          <div className="scanning-container">
            <div className="doc-icon">
              <div className="doc-page" />
              <motion.div 
                className="scan-beam"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <style jsx>{`
              .scanning-container { display: flex; align-items: center; justify-content: center; height: 120px; }
              .doc-icon { 
                width: 60px; height: 80px; background: white; border: 2px solid var(--border-subtle); 
                border-radius: 8px; position: relative; overflow: hidden; box-shadow: var(--shadow-sm);
              }
              .doc-page { width: 100%; height: 100%; opacity: 0.1; background: repeating-linear-gradient(white, white 10px, #ccc 10px, #ccc 12px); }
              .scan-beam { 
                position: absolute; left: 0; right: 0; height: 4px; 
                background: var(--brand-primary); box-shadow: 0 0 15px var(--brand-primary);
                z-index: 2;
              }
            `}</style>
          </div>
        );
      
      case 'thinking':
        return (
          <div className="thinking-container">
            <div className="atom">
              <motion.div 
                className="nucleus"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              {[0, 1, 2].map(i => (
                <motion.div 
                  key={i}
                  className="electron"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                  style={{ transform: `rotate(${i * 60}deg)` }}
                />
              ))}
            </div>
            <style jsx>{`
              .thinking-container { display: flex; align-items: center; justify-content: center; height: 120px; }
              .atom { width: 60px; height: 60px; position: relative; }
              .nucleus { 
                position: absolute; top: 50%; left: 50%; width: 12px; height: 12px; 
                background: var(--brand-primary); border-radius: 50%; margin: -6px;
                box-shadow: 0 0 15px var(--brand-primary);
              }
              .electron {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                border: 1px solid var(--brand-primary); border-radius: 50%; opacity: 0.3;
              }
            `}</style>
          </div>
        );

      case 'writing':
        return (
          <div className="writing-container">
            <div className="shimmer-lines">
              {[1, 2, 3].map(i => (
                <div key={i} className="line">
                  <motion.div 
                    className="shimmer"
                    animate={{ left: ['-100%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  />
                </div>
              ))}
            </div>
            <style jsx>{`
              .writing-container { width: 100%; padding: 20px 0; }
              .shimmer-lines { display: flex; flex-direction: column; gap: 12px; }
              .line { height: 12px; background: #f1f5f9; border-radius: 6px; position: relative; overflow: hidden; width: ${Math.random() * 40 + 60}%; }
              .shimmer { position: absolute; top: 0; height: 100%; width: 50%; background: linear-gradient(90deg, transparent, rgba(255,107,74,0.1), transparent); }
            `}</style>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="nova-loader-v4">
      {renderLoader()}
      {text && (
        <motion.p 
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="loader-text"
        >
          {text}
        </motion.p>
      )}
      <style jsx>{`
        .nova-loader-v4 { display: flex; flex-direction: column; align-items: center; gap: 16px; width: 100%; }
        .loader-text { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; }
      `}</style>
    </div>
  );
};

export default NovaLoader;
