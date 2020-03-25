import React, { useState, useCallback } from "react";
import { useRequestAnimationFrame } from "beautiful-react-hooks";
import "./App.css";

function App() {
    const [wave, setWave] = useState([
        //   X ,   Y
        [0, 50], // Vänster kant
        [0, 0],
        [100, 0],
        [100, 50] //högerkant kant
    ]);

    const [movingWaves, setMovingWawes] = useState([
        { id: "0", color: "purple", x: 92, y: 70, _y: 50, amplitud: 10, frequncy: 40 },
        { id: "a", color: "green", x: 75, y: 70, _y: 50, amplitud: 11, frequncy: 39 },
        { id: "b", color: "pink", x: 49, y: 70, _y: 50, amplitud: 12, frequncy: 37 },
        { id: "c", color: "orange", x: 17, y: 70, _y: 50, amplitud: 20, frequncy: 35 }
    ]);
    const movement = 0.08;

    useRequestAnimationFrame(
        (progress, next) => {
            // console.group("PROGRESS", progress);
            const moveTo = movingWaves.map((point, index) => {
                point.x = point.x + movement;
                point.y = point._y / 2 + point.amplitud * Math.sin(progress / point.frequncy);
                point.dy = point._y / 2 - (point.amplitud * Math.sin(progress / point.frequncy)) / 4;
                // point.dx = index < movingWaves.length - 1 ? movingWaves[index + 1].x + (point.x - movingWaves[index + 1].x) / 2 : point.x / 2;
                point.dx = point.x - movement * 125;

                if (point.x >= 100) {
                    // börja om
                    // const a = Math.random();
                    // const b = Math.floor(Math.random());
                    // const c = b ? a : 0 - a;
                    // point.amplitud = point.amplitud + c;
                    // point.frequncy = point.frequncy + c;
                    point.x = movement;
                }
                return point;
            });
            moveTo.sort((a, b) => (a.x <= b.x ? 1 : -1));

            let rightDiff = moveTo[0].y - wave[3][1];
            let movesForRightToTarget = parseInt((100 - moveTo[0].x) / movement, 10);
            let sideMovement = rightDiff / movesForRightToTarget;

            const newWave = [...wave];
            if (movesForRightToTarget > 0) {
                newWave[3][1] = newWave[3][1] + sideMovement;
                newWave[0][1] = newWave[0][1] + sideMovement;
            }

            // console.log("Ordning:", moveTo.map(i => i.id).join(" > "));
            // console.log("Nästa:", moveTo[0].id, moveTo[0].y);
            // console.log("Höger:", wave[3][1]);
            // console.log("rightDiff:", rightDiff);
            // console.log("sideMovement:", sideMovement);
            // console.log("movesForRightToTarget:", movesForRightToTarget);

            setWave(newWave);
            setMovingWawes(moveTo);
            // console.groupEnd();
            next();
        },
        { increment: 0.25, startAt: 1, finishAt: 1 }
    );

    return (
        <div className="App">
            <header className="App-header">
                <svg version="1.1" id="wave" x="0px" y="0px" viewBox="0 0 100 100">
                    {/* <polygon points={movingWaves.map(point => point.x + "," + point.y).join(" ") + " " + wave.join(" ")} /> */}
                    <path
                        d={
                            "M100," +
                            wave[3][1] +
                            " V0 H0 V" +
                            wave[3][1] +
                            " " +
                            movingWaves
                                .reverse()
                                .map(point => "Q " + point.dx + " " + point.dy + " " + point.x + " " + point.y)
                                .join(" ") +
                            " Z"
                        }
                        fill="PowderBlue"
                    />
                    {movingWaves.map(point => (
                        <>
                            <circle cx={point.x} cy={point.y} r={0.1 * point.amplitud} fill={point.color} fill-opacity="1" />
                            <circle cx={point.dx} cy={point.dy} r={0.1 * point.amplitud} fill={point.color} fill-opacity="0.5" />
                        </>
                    ))}
                    <circle cx="0" cy={wave[0][1]} r={1} fill="purple" />
                    <circle cx="100" cy={wave[3][1]} r={1} fill="red" />
                </svg>
            </header>
        </div>
    );
}

export default App;
