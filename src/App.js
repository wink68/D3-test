import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const lines = [
  {
    points: [{ x: 52, y: 340 }, { x: 145, y: 242 }, { x: 243, y: 158 }, { x: 359, y: 236 }, { x: 456, y: 333 }, { x: 541, y: 227 }, { x: 644, y: 148 }, { x: 731, y: 239 }],
    category: "범주 1",
  },
  {
    points: [{ x: 57, y: 124 }, { x: 149, y: 321 }, { x: 252, y: 213 }, { x: 355, y: 137 }, { x: 444, y: 321 }, { x: 548, y: 129 }, { x: 643, y: 212 }, { x: 742, y: 323 }],
    category: "범주 2",
  },
  {
    points: [{ x: 49, y: 189 }, { x: 143, y: 279 }, { x: 249, y: 198 }, { x: 357, y: 287 }, { x: 442, y: 195 }, { x: 539, y: 278 }, { x: 649, y: 199 }, { x: 737, y: 292 }],
    category: "범주 3",
  },
  {
    points: [{ x: 59, y: 295 }, { x: 141, y: 192 }, { x: 255, y: 295 }, { x: 349, y: 188 }, { x: 457, y: 296 }, { x: 544, y: 182 }, { x: 652, y: 292 }, { x: 739, y: 179 }],
    category: "범주 4",
  },
  {
    points: [{ x: 54, y: 264 }, { x: 146, y: 169 }, { x: 253, y: 266 }, { x: 351, y: 157 }, { x: 456, y: 263 }, { x: 539, y: 154 }, { x: 641, y: 265 }, { x: 746, y: 166 }],
    category: "범주 5",
  },
  {
    points: [{ x: 56, y: 310 }, { x: 147, y: 218 }, { x: 248, y: 308 }, { x: 358, y: 209 }, { x: 453, y: 312 }, { x: 540, y: 210 }, { x: 639, y: 311 }, { x: 734, y: 216 }],
    category: "범주 6",
  },
  {
    points: [ { x: 58, y: 234 }, { x: 142, y: 144 }, { x: 250, y: 234 }, { x: 353, y: 137 }, { x: 454, y: 232 }, { x: 547, y: 136 }, { x: 640, y: 238 }, { x: 748, y: 129 }],
    category: "범주 7",
  },
];

const App = () => {
  const svgRef = useRef(null);

  // 각 범주의 위치를 저장하는 배열
  let categoriesY = [];

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    categoriesY = [];   // 초기화

    const width = 800;
    const height = 400;

    // 그래프 선 생성함수
    const lineGenerator = d3.line()
      .x(d => d.x)
      .y(d => d.y);

    // 그래프 축
    const xScale = d3.scaleLinear().domain([0, width]).range([0, width]);     /* [최소값, 최대값] */
    const yScale = d3.scaleLinear().domain([0, height]).range([height, 0]);   /* 기존 간격(입력범위, domain)을 새로운 간격(출력범위, range)으로 변환 */
    const xAxis = d3.axisBottom(xScale);  /* x축 생성 */
    const yAxis = d3.axisLeft(yScale);    /* y축 생성 */
    svg.append("g").call(xAxis).attr("transform", `translate(0, ${height})`);  /* x축을 아래쪽으로 height만큼 이동 */
    svg.append("g").call(yAxis);  /* call : 축 그리기 */

    // 선 추가
    lines.forEach((line, idx) => {
      let lineEndY = line.points[line.points.length - 1].y;
      let labelY = lineEndY;

      // 범주의 위치가 다른 범주와 겹치는지 확인
      let overlaps = true;
      while (overlaps) {
        overlaps = false;
        for (let y of categoriesY) {
          if (Math.abs(y - labelY) < 20) { // 20은 글자 크기에 따라 조정 가능
            labelY -= 20; // 위로 20만큼 이동
            overlaps = true; // 겹치는 것을 발견하면 overlaps를 true로 설정
            break;
          }
        }
      }
      categoriesY.push(labelY);

      svg.append("path")
         .attr("d", lineGenerator(line.points))
         .attr("stroke", idx % 2 === 0 ? "blue" : "red")
         .attr("fill", "none");

      // x축 끝에 점선 추가
      svg.append("line")
         .attr("x1", width)
         .attr("y1", lineEndY)  /* 그래프 선 끝 y축 높이 */
         .attr("x2", width + (lineEndY !== labelY ? 15 : 30))  // 꺾는 선이 있는 경우에는 좌표를 조정
         .attr("y2", lineEndY)
         .attr("stroke", idx % 2 === 0 ? "blue" : "red")
         .attr("stroke-dasharray", "5,5");

      if (lineEndY !== labelY) {  // 꺾는 선이 필요한 경우
        svg.append("line")
           .attr("x1", width + 15)
           .attr("y1", lineEndY)
           .attr("x2", width + 15)
           .attr("y2", labelY)
           .attr("stroke", idx % 2 === 0 ? "blue" : "red")
           .attr("stroke-dasharray", "5,5");

        svg.append("line")
           .attr("x1", width + 15)
           .attr("y1", labelY)
           .attr("x2", width + 30)
           .attr("y2", labelY)
           .attr("stroke", idx % 2 === 0 ? "blue" : "red")
           .attr("stroke-dasharray", "5,5");
      }

      // 범주명 추가
      svg.append("text")
         .attr("x", width + 35)
         .attr("y", labelY + 5)
         .attr("fill", idx % 2 === 0 ? "blue" : "red")
         .text(line.category);
    });

  }, []);

  return (
    <svg ref={svgRef} width={900} height={400}></svg>
  );
};

export default App;