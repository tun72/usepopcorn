import { useState, useEffect } from "react";
export function useKey(key, callback) {
  useEffect(
    function () {
      function keydown(e) {
        if (e.code === key) {
          callback();
        }
      }

      document.addEventListener("keydown", keydown);

      return function () {
        document.removeEventListener("keydown", keydown);
      };
    },
    [callback]
  );
}
