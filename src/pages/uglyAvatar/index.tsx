import React, { useState, useRef, useEffect } from 'react';
import { View, Button, Canvas } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { randomFromInterval, faceShape, eyeShape, hairLines, mouthShape } from './utils';

const UglyAvatar: React.FC = () => {
  // 状态管理
  const [faceScale, setFaceScale] = useState(1.8);
  const [computedFacePoints, setComputedFacePoints] = useState<number[][]>([]);
  const [eyeRightUpper, setEyeRightUpper] = useState<number[][]>([]);
  const [eyeRightLower, setEyeRightLower] = useState<number[][]>([]);
  const [eyeRightCountour, setEyeRightCountour] = useState<number[][]>([]);
  const [eyeLeftUpper, setEyeLeftUpper] = useState<number[][]>([]);
  const [eyeLeftLower, setEyeLeftLower] = useState<number[][]>([]);
  const [eyeLeftCountour, setEyeLeftCountour] = useState<number[][]>([]);
  const [faceHeight, setFaceHeight] = useState(0);
  const [faceWidth, setFaceWidth] = useState(0);
  const [center, setCenter] = useState<number[]>([0, 0]);
  const [distanceBetweenEyes, setDistanceBetweenEyes] = useState(0);
  const [leftEyeOffsetX, setLeftEyeOffsetX] = useState(0);
  const [leftEyeOffsetY, setLeftEyeOffsetY] = useState(0);
  const [rightEyeOffsetX, setRightEyeOffsetX] = useState(0);
  const [rightEyeOffsetY, setRightEyeOffsetY] = useState(0);
  const [eyeHeightOffset, setEyeHeightOffset] = useState(0);
  const [leftEyeCenter, setLeftEyeCenter] = useState<number[]>([0, 0]);
  const [rightEyeCenter, setRightEyeCenter] = useState<number[]>([0, 0]);
  const [rightPupilShiftX, setRightPupilShiftX] = useState(0);
  const [rightPupilShiftY, setRightPupilShiftY] = useState(0);
  const [leftPupilShiftX, setLeftPupilShiftX] = useState(0);
  const [leftPupilShiftY, setLeftPupilShiftY] = useState(0);
  const [rightNoseCenterX, setRightNoseCenterX] = useState(0);
  const [rightNoseCenterY, setRightNoseCenterY] = useState(0);
  const [leftNoseCenterX, setLeftNoseCenterX] = useState(0);
  const [leftNoseCenterY, setLeftNoseCenterY] = useState(0);
  const [hairs, setHairs] = useState<number[][][]>([]);
  const [haventSleptForDays, setHaventSleptForDays] = useState(false);
  const [hairColor, setHairColor] = useState('black');
  const [dyeColorOffset, setDyeColorOffset] = useState('50%');
  const [mouthPoints, setMouthPoints] = useState<number[][]>([]);
  const [showPointNose, setShowPointNose] = useState(true);
  const [faceShapeType, setFaceShapeType] = useState(0);
  const [backgroundColorIndex, setBackgroundColorIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const canvasRef = useRef<any>(null);

  // 颜色数组
  const hairColors = [
    'rgb(0, 0, 0)', // Black
    'rgb(44, 34, 43)', // Dark Brown
    'rgb(80, 68, 68)', // Medium Brown
    'rgb(167, 133, 106)', // Light Brown
    'rgb(220, 208, 186)', // Blond
    'rgb(233, 236, 239)', // Platinum Blond
    'rgb(165, 42, 42)', // Red
    'rgb(145, 85, 61)', // Auburn
    'rgb(128, 128, 128)', // Grey
    'rgb(185, 55, 55)', // Fire
    // ... 更多颜色
  ];

  const backgroundColors = [
    'rgb(245, 245, 220)', // Soft Beige
    'rgb(176, 224, 230)', // Pale Blue
    'rgb(211, 211, 211)', // Light Grey
    'rgb(152, 251, 152)', // Pastel Green
    'rgb(255, 253, 208)', // Cream
    'rgb(230, 230, 250)', // Muted Lavender
    'rgb(188, 143, 143)', // Dusty Rose
    'rgb(135, 206, 235)', // Sky Blue
    'rgb(245, 255, 250)', // Mint Cream
    'rgb(245, 222, 179)', // Wheat
    // ... 更多颜色
  ];

  // 生成头像函数
  const generateFace = () => {
    setIsGenerating(true);
    
    // 添加短暂延迟以显示加载状态
    setTimeout(() => {
      setFaceScale(1.5 + Math.random() * 0.6);
      setHaventSleptForDays(Math.random() > 0.8);
    
    const faceResults = faceShape.generateFaceCountourPoints(faceShapeType);
    setComputedFacePoints(faceResults.face);
    setFaceHeight(faceResults.height);
    setFaceWidth(faceResults.width);
    setCenter(faceResults.center);
    
    const eyes = eyeShape.generateBothEyes(faceResults.width / 2);
    const left = eyes.left;
    const right = eyes.right;
    
    setEyeRightUpper(right.upper);
    setEyeRightLower(right.lower);
    setEyeRightCountour(right.upper.slice(10, 90).concat(right.lower.slice(10, 90).reverse()));
    setEyeLeftUpper(left.upper);
    setEyeLeftLower(left.lower);
    setEyeLeftCountour(left.upper.slice(10, 90).concat(left.lower.slice(10, 90).reverse()));
    
    setDistanceBetweenEyes(randomFromInterval(faceResults.width / 4.5, faceResults.width / 4));
    setEyeHeightOffset(randomFromInterval(faceResults.height / 8, faceResults.height / 6));
    setLeftEyeOffsetX(randomFromInterval(-faceResults.width / 20, faceResults.width / 10));
    setLeftEyeOffsetY(randomFromInterval(-faceResults.height / 50, faceResults.height / 50));
    setRightEyeOffsetX(randomFromInterval(-faceResults.width / 20, faceResults.width / 10));
    setRightEyeOffsetY(randomFromInterval(-faceResults.height / 50, faceResults.height / 50));
    
    setLeftEyeCenter(left.center[0]);
    setRightEyeCenter(right.center[0]);
    
    // 生成瞳孔位移
     if (left.upper.length > 20 && right.upper.length > 20) {
       const leftInd0 = Math.floor(randomFromInterval(10, left.upper.length - 10));
       const rightInd0 = Math.floor(randomFromInterval(10, right.upper.length - 10));
       const leftInd1 = Math.floor(randomFromInterval(10, left.lower.length - 10));
       const rightInd1 = Math.floor(randomFromInterval(10, right.lower.length - 10));
       const leftLerp = randomFromInterval(0.2, 0.8);
       const rightLerp = randomFromInterval(0.2, 0.8);
       
       const leftUpperPoint = left.upper[leftInd0];
       const leftLowerPoint = left.lower[leftInd1];
       const rightUpperPoint = right.upper[rightInd0];
       const rightLowerPoint = right.lower[rightInd1];
       
       if (leftUpperPoint && leftLowerPoint) {
         setLeftPupilShiftY(leftUpperPoint[1] * leftLerp + leftLowerPoint[1] * (1 - leftLerp));
         setLeftPupilShiftX(leftUpperPoint[0] * leftLerp + leftLowerPoint[0] * (1 - leftLerp));
       }
       
       if (rightUpperPoint && rightLowerPoint) {
         setRightPupilShiftY(rightUpperPoint[1] * rightLerp + rightLowerPoint[1] * (1 - rightLerp));
         setRightPupilShiftX(rightUpperPoint[0] * rightLerp + rightLowerPoint[0] * (1 - rightLerp));
       }
     }
    
    // 生成头发
     const numHairLines: number[] = [];
     const numHairMethods = 4;
     for (let i = 0; i < numHairMethods; i++) {
       numHairLines.push(Math.floor(randomFromInterval(0, 50)));
     }
     
     let newHairs: number[][][] = [];
     if (Math.random() > 0.3) {
       newHairs = hairLines.generateHairLines0(faceResults.face, Math.floor(numHairLines[0] * 1 + 10));
     }
     if (Math.random() > 0.3) {
       newHairs = newHairs.concat(hairLines.generateHairLines1(faceResults.face, Math.floor(numHairLines[1] / 1.5 + 10)));
     }
     if (Math.random() > 0.5) {
       newHairs = newHairs.concat(hairLines.generateHairLines2(faceResults.face, Math.floor(numHairLines[2] * 3 + 10)));
     }
     if (Math.random() > 0.5) {
       newHairs = newHairs.concat(hairLines.generateHairLines3(faceResults.face, Math.floor(numHairLines[3] * 3 + 10)));
     }
     setHairs(newHairs);
    
    // 设置鼻子位置
     const newRightNoseCenterX = randomFromInterval(faceResults.width / 18, faceResults.width / 12);
     const newRightNoseCenterY = randomFromInterval(0, faceResults.height / 5);
     const newLeftNoseCenterX = randomFromInterval(-faceResults.width / 18, -faceResults.width / 12);
     const newLeftNoseCenterY = newRightNoseCenterY + randomFromInterval(-faceResults.height / 30, faceResults.height / 20);
     
     setRightNoseCenterX(newRightNoseCenterX);
     setRightNoseCenterY(newRightNoseCenterY);
     setLeftNoseCenterX(newLeftNoseCenterX);
     setLeftNoseCenterY(newLeftNoseCenterY);
    
    // 设置头发颜色
    if (Math.random() > 0.1) {
      setHairColor(hairColors[Math.floor(Math.random() * 10)]);
    } else {
      setHairColor('url(#rainbowGradient)');
      setDyeColorOffset(randomFromInterval(0, 100) + '%');
    }
    
    // 生成嘴巴
    const choice = Math.floor(Math.random() * 3);
    if (choice === 0) {
      setMouthPoints(mouthShape.generateMouthShape0(faceResults.face, faceResults.width, faceResults.height));
    } else if (choice === 1) {
      setMouthPoints(mouthShape.generateMouthShape1(faceResults.face, faceResults.width, faceResults.height));
    } else {
      setMouthPoints(mouthShape.generateMouthShape2(faceResults.face, faceResults.width, faceResults.height));
    }
    
    setShowPointNose(Math.random() > 0.5);
    setBackgroundColorIndex(Math.floor(Math.random() * backgroundColors.length));
    
    // 绘制到Canvas
    drawToCanvas();
    
    setIsGenerating(false);
    }, 100);
  };

  // 绘制到Canvas的函数
  const drawToCanvas = () => {
    if (!canvasRef.current) return;
    
    const ctx = Taro.createCanvasContext('face-canvas', canvasRef.current);
    
    // 设置背景
    ctx.setFillStyle(backgroundColors[backgroundColorIndex]);
    ctx.fillRect(0, 0, 300, 300);
    
    // 计算缩放比例，确保头像完全显示在Canvas内
    const maxDimension = Math.max(faceWidth, faceHeight);
    const scale = maxDimension > 0 ? Math.min(120, 300 / (maxDimension * 2.5)) : 1;
    const centerX = 150;
    const centerY = 150;
    
    // 绘制脸部轮廓
    if (computedFacePoints.length > 0) {
      ctx.beginPath();
      ctx.setFillStyle('#ffc9a9');
      ctx.setStrokeStyle('black');
      ctx.setLineWidth(3.0 / faceScale);
      
      computedFacePoints.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point[0] * scale + centerX, point[1] * scale + centerY);
        } else {
          ctx.lineTo(point[0] * scale + centerX, point[1] * scale + centerY);
        }
      });
      
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    
    // 绘制眼睛
    drawEyes(ctx, scale, centerX, centerY);
    
    // 绘制头发
    drawHairs(ctx, scale, centerX, centerY);
    
    // 绘制鼻子
    drawNose(ctx, scale, centerX, centerY);
    
    // 绘制嘴巴
    drawMouth(ctx, scale, centerX, centerY);
    
    ctx.draw();
  };

  const drawEyes = (ctx: any, scale: number, centerX: number, centerY: number) => {
    // 绘制右眼
    if (eyeRightUpper.length > 0) {
      ctx.beginPath();
      ctx.setStrokeStyle('black');
      ctx.setLineWidth((haventSleptForDays ? 5.0 : 3.0) / faceScale);
      
      eyeRightUpper.forEach((point, index) => {
        const x = (point[0] + center[0] + distanceBetweenEyes + rightEyeOffsetX) * scale + centerX;
        const y = (-point[1] - center[1] + eyeHeightOffset + rightEyeOffsetY) * scale + centerY;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
    }
    
    // 绘制左眼
    if (eyeLeftUpper.length > 0) {
      ctx.beginPath();
      ctx.setStrokeStyle('black');
      ctx.setLineWidth((haventSleptForDays ? 5.0 : 3.0) / faceScale);
      
      eyeLeftUpper.forEach((point, index) => {
        const x = (-point[0] - center[0] - distanceBetweenEyes - leftEyeOffsetX) * scale + centerX;
        const y = (-point[1] - center[1] + eyeHeightOffset + leftEyeOffsetY) * scale + centerY;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
    }
  };

  const drawHairs = (ctx: any, scale: number, centerX: number, centerY: number) => {
    ctx.setStrokeStyle(hairColor);
    hairs.forEach(hair => {
      if (hair.length > 0) {
        ctx.beginPath();
        ctx.setLineWidth(0.5 + Math.random() * 2.5);
        
        hair.forEach((point: number[], index: number) => {
          if (index === 0) {
            ctx.moveTo(point[0] * scale + centerX, point[1] * scale + centerY);
          } else {
            ctx.lineTo(point[0] * scale + centerX, point[1] * scale + centerY);
          }
        });
        
        ctx.stroke();
      }
    });
  };

  const drawNose = (ctx: any, scale: number, centerX: number, centerY: number) => {
    ctx.setStrokeStyle('black');
    ctx.setFillStyle('none');
    
    if (showPointNose) {
      // 绘制点状鼻子
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.arc(
          (rightNoseCenterX + Math.random() * 4 - 2) * scale + centerX,
          (rightNoseCenterY + Math.random() * 4 - 2) * scale + centerY,
          Math.random() * 2 + 1.0,
          0,
          2 * Math.PI
        );
        ctx.stroke();
      }
      
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.arc(
          (leftNoseCenterX + Math.random() * 4 - 2) * scale + centerX,
          (leftNoseCenterY + Math.random() * 4 - 2) * scale + centerY,
          Math.random() * 2 + 1.0,
          0,
          2 * Math.PI
        );
        ctx.stroke();
      }
    } else {
      // 绘制线状鼻子
      ctx.beginPath();
      ctx.setLineWidth(2.5 + Math.random() * 1.0);
      ctx.moveTo(leftNoseCenterX * scale + centerX, leftNoseCenterY * scale + centerY);
      ctx.quadraticCurveTo(
        rightNoseCenterX * scale + centerX,
        rightNoseCenterY * 1.5 * scale + centerY,
        (leftNoseCenterX + rightNoseCenterX) / 2 * scale + centerX,
        -eyeHeightOffset * 0.2 * scale + centerY
      );
      ctx.stroke();
    }
  };

  const drawMouth = (ctx: any, scale: number, centerX: number, centerY: number) => {
    if (mouthPoints.length > 0) {
      ctx.beginPath();
      ctx.setFillStyle('rgb(215,127,140)');
      ctx.setStrokeStyle('black');
      ctx.setLineWidth(2.7 + Math.random() * 0.5);
      
      mouthPoints.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point[0] * scale + centerX, point[1] * scale + centerY);
        } else {
          ctx.lineTo(point[0] * scale + centerX, point[1] * scale + centerY);
        }
      });
      
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  };

  // 下载功能
  const downloadSVGAsPNG = () => {
    if (!canvasRef.current) return;
    
    Taro.canvasToTempFilePath({
      canvasId: 'face-canvas',
      success: (res) => {
        Taro.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            Taro.showToast({
              title: '保存成功',
              icon: 'success'
            });
          },
          fail: () => {
            Taro.showToast({
              title: '保存失败',
              icon: 'error'
            });
          }
        });
      }
    }, canvasRef.current);
  };

  // 组件挂载时生成初始头像
  useEffect(() => {
    generateFace();
  }, []);

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View className={styles.title}>丑头像生成器</View>
        <View className={styles.subtitle}>点击生成按钮创建独特的丑头像</View>
      </View>
      
      <View className={styles.canvasContainer}>
        <Canvas
          ref={canvasRef}
          canvasId="face-canvas"
          className={styles.canvas}
        />
      </View>
      
      <View className={styles.buttonContainer}>
        <Button 
          className={styles.generateBtn}
          onClick={generateFace}
          disabled={isGenerating}
        >
          {isGenerating ? '生成中...' : '生成新头像'}
        </Button>
        
        <Button 
          className={styles.saveBtn}
          onClick={downloadSVGAsPNG}
        >
          保存头像
        </Button>
      </View>
    </View>
  );
};

export default UglyAvatar;
