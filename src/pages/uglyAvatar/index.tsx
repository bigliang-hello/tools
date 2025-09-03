import React, { useState, useRef, useEffect } from 'react';
import { View } from '@tarojs/components';
import { AtNavBar } from 'taro-ui'
import * as faceShape from './utils/face_shape.js';
import * as eyeShape from './utils/eye_shape.js';
import * as hairLines from './utils/hair_lines.js';
import * as mouthShape from './utils/mouth_shape.js';
import './index.module.scss';
import styles from './index.module.scss'

// 定义类型
type Point = number[];
type Points = Point[];

function randomFromInterval(min: number, max: number): number {
  // min and max included
  return Math.random() * (max - min) + min;
}

const FaceGenerator: React.FC = () => {
  // 状态变量，对应Vue中的data
  const [faceScale, setFaceScale] = useState<number>(1.8);
  const [computedFacePoints, setComputedFacePoints] = useState<Points>([]);
  const [eyeRightUpper, setEyeRightUpper] = useState<Points>([]);
  const [eyeRightLower, setEyeRightLower] = useState<Points>([]);
  const [eyeRightCountour, setEyeRightCountour] = useState<Points>([]);
  const [eyeLeftUpper, setEyeLeftUpper] = useState<Points>([]);
  const [eyeLeftLower, setEyeLeftLower] = useState<Points>([]);
  const [eyeLeftCountour, setEyeLeftCountour] = useState<Points>([]);
  const [faceHeight, setFaceHeight] = useState<number>(0);
  const [faceWidth, setFaceWidth] = useState<number>(0);
  const [center, setCenter] = useState<Point>([0, 0]);
  const [distanceBetweenEyes, setDistanceBetweenEyes] = useState<number>(0);
  const [leftEyeOffsetX, setLeftEyeOffsetX] = useState<number>(0);
  const [leftEyeOffsetY, setLeftEyeOffsetY] = useState<number>(0);
  const [rightEyeOffsetX, setRightEyeOffsetX] = useState<number>(0);
  const [rightEyeOffsetY, setRightEyeOffsetY] = useState<number>(0);
  const [eyeHeightOffset, setEyeHeightOffset] = useState<number>(0);
  const [leftEyeCenter, setLeftEyeCenter] = useState<Point>([0, 0]);
  const [rightEyeCenter, setRightEyeCenter] = useState<Point>([0, 0]);
  const [rightPupilShiftX, setRightPupilShiftX] = useState<number>(0);
  const [rightPupilShiftY, setRightPupilShiftY] = useState<number>(0);
  const [leftPupilShiftX, setLeftPupilShiftX] = useState<number>(0);
  const [leftPupilShiftY, setLeftPupilShiftY] = useState<number>(0);
  const [rightNoseCenterX, setRightNoseCenterX] = useState<number>(0);
  const [rightNoseCenterY, setRightNoseCenterY] = useState<number>(0);
  const [leftNoseCenterX, setLeftNoseCenterX] = useState<number>(0);
  const [leftNoseCenterY, setLeftNoseCenterY] = useState<number>(0);
  const [hairs, setHairs] = useState<Points>([]);
  const [haventSleptForDays, setHaventSleptForDays] = useState<boolean>(false);
  const [mouthPoints, setMouthPoints] = useState<Points>([]);
  const [hairColor, setHairColor] = useState<string>('black');
  const [dyeColorOffset, setDyeColorOffset] = useState<string>('50%');
  
  // 引用SVG元素，用于下载功能
  const svgRef = useRef(null);

  // 颜色数组
  const hairColors = [
    "rgb(0, 0, 0)", // Black
        "rgb(44, 34, 43)", // Dark Brown
        "rgb(80, 68, 68)", // Medium Brown
        "rgb(167, 133, 106)", // Light Brown
        "rgb(220, 208, 186)", // Blond
        "rgb(233, 236, 239)", // Platinum Blond
        "rgb(165, 42, 42)", // Red
        "rgb(145, 85, 61)", // Auburn
        "rgb(128, 128, 128)", // Grey
        "rgb(185, 55, 55)", // Fire
        "rgb(255, 192, 203)", // Pastel Pink
        "rgb(255, 105, 180)", // Bright Pink
        "rgb(230, 230, 250)", // Lavender
        "rgb(64, 224, 208)", // Turquoise
        "rgb(0, 191, 255)", // Bright Blue
        "rgb(148, 0, 211)", // Deep Purple
        "rgb(50, 205, 50)", // Lime Green
        "rgb(255, 165, 0)", // Vivid Orange
        "rgb(220, 20, 60)", // Crimson Red
        "rgb(192, 192, 192)", // Silver
        "rgb(255, 215, 0)", // Gold
        "rgb(255, 255, 255)", // White
        "rgb(124, 252, 0)", // Lawn Green
        "rgb(127, 255, 0)", // Chartreuse
        "rgb(0, 255, 127)", // Spring Green
        "rgb(72, 209, 204)", // Medium Turquoise
        "rgb(0, 255, 255)", // Cyan
        "rgb(0, 206, 209)", // Dark Turquoise
        "rgb(32, 178, 170)", // Light Sea Green
        "rgb(95, 158, 160)", // Cadet Blue
        "rgb(70, 130, 180)", // Steel Blue
        "rgb(176, 196, 222)", // Light Steel Blue
        "rgb(30, 144, 255)", // Dodger Blue
        "rgb(135, 206, 235)", // Sky Blue
        "rgb(0, 0, 139)", // Dark Blue
        "rgb(138, 43, 226)", // Blue Violet
        "rgb(75, 0, 130)", // Indigo
        "rgb(139, 0, 139)", // Dark Magenta
        "rgb(153, 50, 204)", // Dark Orchid
        "rgb(186, 85, 211)", // Medium Orchid
        "rgb(218, 112, 214)", // Orchid
        "rgb(221, 160, 221)", // Plum
        "rgb(238, 130, 238)", // Violet
        "rgb(255, 0, 255)", // Magenta
        "rgb(216, 191, 216)", // Thistle
        "rgb(255, 20, 147)", // Deep Pink
        "rgb(255, 69, 0)", // Orange Red
        "rgb(255, 140, 0)", // Dark Orange
        "rgb(255, 165, 0)", // Orange
        "rgb(250, 128, 114)", // Salmon
        "rgb(233, 150, 122)", // Dark Salmon
        "rgb(240, 128, 128)", // Light Coral
        "rgb(205, 92, 92)", // Indian Red
        "rgb(255, 99, 71)", // Tomato
        "rgb(255, 160, 122)", // Light Salmon
        "rgb(220, 20, 60)", // Crimson
        "rgb(139, 0, 0)", // Dark Red
        "rgb(178, 34, 34)", // Fire Brick
        "rgb(250, 235, 215)", // Antique White
        "rgb(255, 239, 213)", // Papaya Whip
        "rgb(255, 235, 205)", // Blanched Almond
        "rgb(255, 222, 173)", // Navajo White
        "rgb(245, 245, 220)", // Beige
        "rgb(255, 228, 196)", // Bisque
        "rgb(255, 218, 185)", // Peach Puff
        "rgb(244, 164, 96)", // Sandy Brown
        "rgb(210, 180, 140)", // Tan
        "rgb(222, 184, 135)", // Burly Wood
        "rgb(250, 250, 210)", // Light Goldenrod Yellow
        "rgb(255, 250, 205)", // Lemon Chiffon
        "rgb(255, 245, 238)", // Sea Shell
        "rgb(253, 245, 230)", // Old Lace
        "rgb(255, 228, 225)", // Misty Rose
        "rgb(255, 240, 245)", // Lavender Blush
        "rgb(250, 240, 230)", // Linen
        "rgb(255, 228, 181)", // Moccasin
        "rgb(255, 250, 250)", // Snow
        "rgb(240, 255, 255)", // Azure
        "rgb(240, 255, 240)", // Honeydew
        "rgb(245, 245, 245)", // White Smoke
        "rgb(245, 255, 250)", // Mint Cream
        "rgb(240, 248, 255)", // Alice Blue
        "rgb(240, 248, 255)", // Ghost White
        "rgb(248, 248, 255)", // Ghost White
        "rgb(255, 250, 240)", // Floral White
        "rgb(253, 245, 230)", // Old Lace
  ];

  const backgroundColors = [
     "rgb(245, 245, 220)", // Soft Beige
        "rgb(176, 224, 230)", // Pale Blue
        "rgb(211, 211, 211)", // Light Grey
        "rgb(152, 251, 152)", // Pastel Green
        "rgb(255, 253, 208)", // Cream
        "rgb(230, 230, 250)", // Muted Lavender
        "rgb(188, 143, 143)", // Dusty Rose
        "rgb(135, 206, 235)", // Sky Blue
        "rgb(245, 255, 250)", // Mint Cream
        "rgb(245, 222, 179)", // Wheat
        "rgb(47, 79, 79)", // Dark Slate Gray
        "rgb(72, 61, 139)", // Dark Slate Blue
        "rgb(60, 20, 20)", // Dark Brown
        "rgb(25, 25, 112)", // Midnight Blue
        "rgb(139, 0, 0)", // Dark Red
        "rgb(85, 107, 47)", // Olive Drab
        "rgb(128, 0, 128)", // Purple
        "rgb(0, 100, 0)", // Dark Green
        "rgb(0, 0, 139)", // Dark Blue
        "rgb(105, 105, 105)", // Dim Gray
        "rgb(240, 128, 128)", // Light Coral
        "rgb(255, 160, 122)", // Light Salmon
        "rgb(255, 218, 185)", // Peach Puff
        "rgb(255, 228, 196)", // Bisque
        "rgb(255, 222, 173)", // Navajo White
        "rgb(255, 250, 205)", // Lemon Chiffon
        "rgb(250, 250, 210)", // Light Goldenrod Yellow
        "rgb(255, 239, 213)", // Papaya Whip
        "rgb(255, 245, 238)", // Sea Shell
        "rgb(255, 248, 220)", // Cornsilk
        "rgb(255, 255, 240)", // Ivory
        "rgb(240, 255, 240)", // Honeydew
        "rgb(240, 255, 255)", // Azure
        "rgb(240, 248, 255)", // Alice Blue
        "rgb(248, 248, 255)", // Ghost White
        "rgb(255, 250, 250)", // Snow
        "rgb(255, 240, 245)", // Lavender Blush
        "rgb(255, 228, 225)", // Misty Rose
        "rgb(230, 230, 250)", // Lavender
        "rgb(216, 191, 216)", // Thistle
        "rgb(221, 160, 221)", // Plum
        "rgb(238, 130, 238)", // Violet
        "rgb(218, 112, 214)", // Orchid
        "rgb(186, 85, 211)", // Medium Orchid
        "rgb(147, 112, 219)", // Medium Purple
        "rgb(138, 43, 226)", // Blue Violet
        "rgb(148, 0, 211)", // Dark Violet
        "rgb(153, 50, 204)", // Dark Orchid
        "rgb(139, 69, 19)", // Saddle Brown
        "rgb(160, 82, 45)", // Sienna
        "rgb(210, 105, 30)", // Chocolate
        "rgb(205, 133, 63)", // Peru
        "rgb(244, 164, 96)", // Sandy Brown
        "rgb(222, 184, 135)", // Burly Wood
        "rgb(255, 250, 240)", // Floral White
        "rgb(253, 245, 230)", // Old Lace
        "rgb(250, 240, 230)", // Linen
  ];

  // 生成面部函数
  const generateFace = () => {
    setFaceScale(1.5 + Math.random() * 0.6);
    setHaventSleptForDays(Math.random() > 0.8);
    
    // 生成面部轮廓
    const faceResults = faceShape.generateFaceCountourPoints();
    setComputedFacePoints(faceResults.face);
    setFaceHeight(faceResults.height);
    setFaceWidth(faceResults.width);
    setCenter(faceResults.center);
    
    // 生成眼睛
    const eyes = eyeShape.generateBothEyes(faceResults.width / 2);
    const left = eyes.left;
    const right = eyes.right;
    
    setEyeRightUpper(right.upper as Points);
    setEyeRightLower(right.lower as Points);
    setEyeRightCountour((right.upper as Points).slice(10, 90).concat((right.lower as Points).slice(10, 90).reverse()));
    
    setEyeLeftUpper(left.upper as Points);
    setEyeLeftLower(left.lower as Points);
    setEyeLeftCountour((left.upper as Points).slice(10, 90).concat((left.lower as Points).slice(10, 90).reverse()));
    
    // 设置眼睛位置参数
    const distBetweenEyes = randomFromInterval(faceResults.width / 4.5, faceResults.width / 4);
    setDistanceBetweenEyes(distBetweenEyes);
    
    const eyeHeightOff = randomFromInterval(faceResults.height / 8, faceResults.height / 6);
    setEyeHeightOffset(eyeHeightOff);
    
    setLeftEyeOffsetX(randomFromInterval(-faceResults.width / 20, faceResults.width / 10));
    setLeftEyeOffsetY(randomFromInterval(-faceResults.height / 50, faceResults.height / 50));
    
    setRightEyeOffsetX(randomFromInterval(-faceResults.width / 20, faceResults.width / 10));
    setRightEyeOffsetY(randomFromInterval(-faceResults.height / 50, faceResults.height / 50));
    
    setLeftEyeCenter(left.center[0]);
    setRightEyeCenter(right.center[0]);
    
    // 生成瞳孔位置
    setLeftPupilShiftX(randomFromInterval(-faceResults.width / 20, faceResults.width / 20));
    
    // 选择眼睑上的点
    const leftInd0 = Math.floor(randomFromInterval(10, left.upper.length - 10));
    const rightInd0 = Math.floor(randomFromInterval(10, right.upper.length - 10));
    const leftInd1 = Math.floor(randomFromInterval(10, left.upper.length - 10));
    const rightInd1 = Math.floor(randomFromInterval(10, right.upper.length - 10));
    const leftLerp = randomFromInterval(0.2, 0.8);
    const rightLerp = randomFromInterval(0.2, 0.8);
    
    setLeftPupilShiftY(left.upper[leftInd0][1] * leftLerp + left.lower[leftInd1][1] * (1 - leftLerp));
    setRightPupilShiftY(right.upper[rightInd0][1] * rightLerp + right.lower[rightInd1][1] * (1 - rightLerp));
    setLeftPupilShiftX(left.upper[leftInd0][0] * leftLerp + left.lower[leftInd1][0] * (1 - leftLerp));
    setRightPupilShiftX(right.upper[rightInd0][0] * rightLerp + right.lower[rightInd1][0] * (1 - rightLerp));
    
    // 生成头发
    const numHairLines: number[] = [];
    const numHairMethods = 4;
    for (let i = 0; i < numHairMethods; i++) {
      numHairLines.push(Math.floor(randomFromInterval(0, 50)));
    }
    
    let hairsArray: Points = [];
    if (Math.random() > 0.3) {
      hairsArray = hairLines.generateHairLines0(faceResults.face, numHairLines[0] * 1 + 10) as unknown as Points;
    }
    if (Math.random() > 0.3) {
      hairsArray = hairsArray.concat(hairLines.generateHairLines1(faceResults.face, numHairLines[1] / 1.5 + 10) as unknown as Points);
    }
    if (Math.random() > 0.5) {
      hairsArray = hairsArray.concat(hairLines.generateHairLines2(faceResults.face, numHairLines[2] * 3 + 10) as Points);
    }
    if (Math.random() > 0.5) {
      // 先将 generateHairLines3 的返回值转为 unknown,再转为 Points 类型
      hairsArray = hairsArray.concat(hairLines.generateHairLines3(faceResults.face, numHairLines[3] * 3 + 10) as unknown as Points);
    }
    setHairs(hairsArray);
    
    // 生成鼻子位置
    setRightNoseCenterX(randomFromInterval(faceResults.width / 18, faceResults.width / 12));
    setRightNoseCenterY(randomFromInterval(0, faceResults.height / 5));
    setLeftNoseCenterX(randomFromInterval(-faceResults.width / 18, -faceResults.width / 12));
    setLeftNoseCenterY(_prev => rightNoseCenterY + randomFromInterval(-faceResults.height / 30, faceResults.height / 20));
    
    // 设置头发颜色
    if (Math.random() > 0.1) {
      // 使用自然发色
      setHairColor(hairColors[Math.floor(Math.random() * 10)]);
    } else {
      // 使用渐变色
      setHairColor('url(#rainbowGradient)');
      setDyeColorOffset(randomFromInterval(0, 100) + '%');
    }
    
    // 生成嘴巴形状
    const choice = Math.floor(Math.random() * 3);
    let mouthPts: Points;
    if (choice === 0) {
      mouthPts = mouthShape.generateMouthShape0(faceResults.face, faceResults.height, faceResults.width) as Points;
    } else if (choice === 1) {
      mouthPts = mouthShape.generateMouthShape1(faceResults.face, faceResults.height, faceResults.width) as Points;
    } else {
      mouthPts = mouthShape.generateMouthShape2(faceResults.face, faceResults.height, faceResults.width) as Points;
    }
    setMouthPoints(mouthPts);
  };

  // 下载SVG为PNG - 优化版本
  const downloadSVGAsPNG = async (filename: string = 'ugly-avatar', quality: number = 1.0, scale: number = 2) => {
    try {
      const svg = document.getElementById("face-svg");
      if (!svg) {
        console.error('SVG元素未找到');
        return;
      }

      // 获取SVG的原始尺寸
      const svgRect = svg.getBoundingClientRect();
      const svgWidth = svgRect.width || 400; // 默认宽度
      const svgHeight = svgRect.height || 400; // 默认高度

      // 创建高质量canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error('无法获取Canvas上下文');
        return;
      }

      // 设置高分辨率canvas
      canvas.width = svgWidth * scale;
      canvas.height = svgHeight * scale;
      ctx.scale(scale, scale);
      
      // 设置高质量渲染
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 序列化SVG数据
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      // 创建图片并等待加载
      const img = new Image();
      
      return new Promise<void>((resolve, reject) => {
        img.onload = () => {
          try {
            // 绘制到canvas
            ctx.drawImage(img, 0, 0, svgWidth, svgHeight);
            
            // 转换为PNG并下载
            canvas.toBlob((blob) => {
              if (!blob) {
                reject(new Error('无法生成PNG图片'));
                return;
              }
              
              const downloadUrl = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = downloadUrl;
              link.download = `${filename}.png`;
              
              // 触发下载
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              // 清理资源
              URL.revokeObjectURL(url);
              URL.revokeObjectURL(downloadUrl);
              
              resolve();
            }, 'image/png', quality);
          } catch (error) {
            reject(error);
          }
        };
        
        img.onerror = () => {
          reject(new Error('图片加载失败'));
        };
        
        img.src = url;
      });
    } catch (error) {
      console.error('下载失败:', error);
      // 可以在这里添加用户友好的错误提示
    }
  };

  // 组件挂载时生成面部
  useEffect(() => {
    generateFace();
  }, []);

  // 将点数组转换为SVG路径字符串
  const pointsToString = (points: Points): string => {
    if (!points || points.length === 0) return '';
    return points.map(point => point.join(',')).join(' ');
  };

  return (
    <View>
      <AtNavBar title="丑头像生成器">111</AtNavBar>
      <View className={styles.container}>
      <svg
        ref={svgRef}
        viewBox="-100 -100 200 200"
        xmlns="http://www.w3.org/2000/svg"
        id="face-svg"
        className={ styles.mySvg }
      >
        <defs>
          <clipPath id="leftEyeClipPath">
            <polyline points={pointsToString(eyeLeftCountour)} />
          </clipPath>
          <clipPath id="rightEyeClipPath">
            <polyline points={pointsToString(eyeRightCountour)} />
          </clipPath>

          <filter id="fuzzy">
            <feTurbulence
              id="turbulence"
              baseFrequency="0.05"
              numOctaves="3"
              type="noise"
              result="noise"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
          <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              style={{
                stopColor: hairColors[Math.floor(Math.random() * 10)],
                stopOpacity: 1
              }}
            />
            <stop
              offset={dyeColorOffset}
              style={{
                stopColor: hairColors[Math.floor(Math.random() * hairColors.length)],
                stopOpacity: 1
              }}
            />
            <stop
              offset="100%"
              style={{
                stopColor: hairColors[Math.floor(Math.random() * hairColors.length)],
                stopOpacity: 1
              }}
            />
          </linearGradient>
        </defs>
        <title>That's an ugly face</title>
        <desc>CREATED BY XUAN TANG, MORE INFO AT TXSTC55.GITHUB.IO</desc>
        <rect
          x="-100"
          y="-100"
          width="100%"
          height="100%"
          fill={backgroundColors[Math.floor(Math.random() * backgroundColors.length)]}
        />
        <polyline
          id="faceContour"
          points={pointsToString(computedFacePoints)}
          fill="#ffc9a9"
          stroke="black"
          strokeWidth={3.0 / faceScale}
          strokeLinejoin="round"
          filter="url(#fuzzy)"
        />

        <g
          transform={`translate(${center[0] + distanceBetweenEyes + rightEyeOffsetX} ${-(-center[1] + eyeHeightOffset + rightEyeOffsetY)})`}
        >
          <polyline
            id="rightCountour"
            points={pointsToString(eyeRightCountour)}
            fill="white"
            stroke="white"
            strokeWidth={0.0 / faceScale}
            strokeLinejoin="round"
            filter="url(#fuzzy)"
          />
        </g>
        <g
          transform={`translate(${-(center[0] + distanceBetweenEyes + leftEyeOffsetX)} ${-(-center[1] + eyeHeightOffset + leftEyeOffsetY)})`}
        >
          <polyline
            id="leftCountour"
            points={pointsToString(eyeLeftCountour)}
            fill="white"
            stroke="white"
            strokeWidth={0.0 / faceScale}
            strokeLinejoin="round"
            filter="url(#fuzzy)"
          />
        </g>
        <g
          transform={`translate(${center[0] + distanceBetweenEyes + rightEyeOffsetX} ${-(-center[1] + eyeHeightOffset + rightEyeOffsetY)})`}
        >
          <polyline
            id="rightUpper"
            points={pointsToString(eyeRightUpper)}
            fill="none"
            stroke="black"
            strokeWidth={(haventSleptForDays ? 5.0 : 3.0) / faceScale}
            strokeLinejoin="round"
            strokeLinecap="round"
            filter="url(#fuzzy)"
          />
          <polyline
            id="rightLower"
            points={pointsToString(eyeRightLower)}
            fill="none"
            stroke="black"
            strokeWidth={(haventSleptForDays ? 5.0 : 3.0) / faceScale}
            strokeLinejoin="round"
            strokeLinecap="round"
            filter="url(#fuzzy)"
          />
          {Array.from({ length: 10 }).map((_, i) => (
            <circle
              key={i}
              r={Math.random() * 2 + 3.0}
              cx={rightPupilShiftX + Math.random() * 5 - 2.5}
              cy={rightPupilShiftY + Math.random() * 5 - 2.5}
              stroke="black"
              fill="none"
              strokeWidth={1.0 + Math.random() * 0.5}
              filter="url(#fuzzy)"
              clipPath="url(#rightEyeClipPath)"
            />
          ))}
        </g>
        <g
          transform={`translate(${-(center[0] + distanceBetweenEyes + leftEyeOffsetX)} ${-(-center[1] + eyeHeightOffset + leftEyeOffsetY)})`}
        >
          <polyline
            id="leftUpper"
            points={pointsToString(eyeLeftUpper)}
            fill="none"
            stroke="black"
            strokeWidth={(haventSleptForDays ? 5.0 : 3.0) / faceScale}
            strokeLinejoin="round"
            filter="url(#fuzzy)"
          />
          <polyline
            id="leftLower"
            points={pointsToString(eyeLeftLower)}
            fill="none"
            stroke="black"
            strokeWidth={(haventSleptForDays ? 5.0 : 3.0) / faceScale}
            strokeLinejoin="round"
            filter="url(#fuzzy)"
          />
          {Array.from({ length: 10 }).map((_, i) => (
            <circle
              key={i}
              r={Math.random() * 2 + 3.0}
              cx={leftPupilShiftX + Math.random() * 5 - 2.5}
              cy={leftPupilShiftY + Math.random() * 5 - 2.5}
              stroke="black"
              fill="none"
              strokeWidth={1.0 + Math.random() * 0.5}
              filter="url(#fuzzy)"
              clipPath="url(#leftEyeClipPath)"
            />
          ))}
        </g>
        <g id="hairs">
          {hairs.map((hair, index) => (
            <polyline
              key={index}
              points={pointsToString([hair])}
              fill="none"
              stroke={hairColor}
              strokeWidth={0.5 + Math.random() * 2.5}
              strokeLinejoin="round"
              filter="url(#fuzzy)"
            />
          ))}
        </g>
        {Math.random() > 0.5 ? (
          <g id="pointNose">
            <g id="rightNose">
              {Array.from({ length: 10 }).map((_, i) => (
                <circle
                  key={i}
                  r={Math.random() * 2 + 1.0}
                  cx={rightNoseCenterX + Math.random() * 4 - 2}
                  cy={rightNoseCenterY + Math.random() * 4 - 2}
                  stroke="black"
                  fill="none"
                  strokeWidth={1.0 + Math.random() * 0.5}
                  filter="url(#fuzzy)"
                />
              ))}
            </g>
            <g id="leftNose">
              {Array.from({ length: 10 }).map((_, i) => (
                <circle
                  key={i}
                  r={Math.random() * 2 + 1.0}
                  cx={leftNoseCenterX + Math.random() * 4 - 2}
                  cy={leftNoseCenterY + Math.random() * 4 - 2}
                  stroke="black"
                  fill="none"
                  strokeWidth={1.0 + Math.random() * 0.5}
                  filter="url(#fuzzy)"
                />
              ))}
            </g>
          </g>
        ) : (
          <g id="lineNose">
            <path
              d={`M ${leftNoseCenterX} ${leftNoseCenterY}, Q${rightNoseCenterX} ${rightNoseCenterY * 1.5},${(leftNoseCenterX + rightNoseCenterX) / 2} ${-eyeHeightOffset * 0.2}`}
              fill="none"
              stroke="black"
              strokeWidth={2.5 + Math.random() * 1.0}
              strokeLinejoin="round"
              filter="url(#fuzzy)"
            />
          </g>
        )}
        <g id="mouth">
          <polyline
            points={pointsToString(mouthPoints)}
            fill="rgb(215,127,140)"
            stroke="black"
            strokeWidth={2.7 + Math.random() * 0.5}
            strokeLinejoin="round"
            filter="url(#fuzzy)"
          />
        </g>
      </svg>
      <button onClick={generateFace} className={ styles.myButton }>随机生成</button>
      <button onClick={() => downloadSVGAsPNG()} className={ styles.myButton }>下载</button>
    </View>
    </View>
    
  );
};

export default FaceGenerator;