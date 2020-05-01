import React from "react";

function Footing() {
    let d = new Date();
    const year = d.getFullYear();
    return <footer><p>Copyright {year}</p></footer>;
}

export default Footing;