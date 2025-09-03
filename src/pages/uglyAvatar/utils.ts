// 导入各个算法模块
import { generateBothEyes } from './utils/eye_shape.js';
import { generateFaceCountourPoints } from './utils/face_shape.js';
import { generateHairLines0, generateHairLines1, generateHairLines2, generateHairLines3 } from './utils/hair_lines.js';
import { generateMouthShape0, generateMouthShape1, generateMouthShape2 } from './utils/mouth_shape.js';

// 工具函数：生成随机数
export function randomFromInterval(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// 脸部形状生成器
export const faceShape = {
  generateFaceCountourPoints(shapeType: number = 0) {
    // 使用原始算法，但可以根据shapeType调整参数
    const result = generateFaceCountourPoints(100);
    
    // 根据脸型类型调整结果
    if (shapeType === 1) {
      // 方脸：调整宽高比
      const scaleFactor = 1.2;
      result.face.forEach(point => {
        point[0] *= scaleFactor; // 增加宽度
        point[1] *= 0.9; // 减少高度
      });
      result.width *= scaleFactor;
      result.height *= 0.9;
    } else if (shapeType === 2) {
      // 长脸：调整宽高比
      const scaleFactor = 0.8;
      result.face.forEach(point => {
        point[0] *= scaleFactor; // 减少宽度
        point[1] *= 1.3; // 增加高度
      });
      result.width *= scaleFactor;
      result.height *= 1.3;
    }
    
    return result;
  }
};

// 眼睛形状生成器
export const eyeShape = {
  generateBothEyes(eyeWidth: number = 50) {
    return generateBothEyes(eyeWidth);
  }
};

// 头发线条生成器
export const hairLines = {
  generateHairLines0(faceContour: number[][], numHairLines: number = 100) {
    return generateHairLines0(faceContour, numHairLines);
  },
  
  generateHairLines1(faceContour: number[][], numHairLines: number = 100) {
    return generateHairLines1(faceContour, numHairLines);
  },
  
  generateHairLines2(faceContour: number[][], numHairLines: number = 100) {
    return generateHairLines2(faceContour, numHairLines);
  },
  
  generateHairLines3(faceContour: number[][], numHairLines: number = 100) {
    return generateHairLines3(faceContour, numHairLines);
  }
};

// 嘴巴形状生成器
export const mouthShape = {
  generateMouthShape0(faceContour: number[][], faceHeight: number, faceWidth: number) {
    return generateMouthShape0(faceContour, faceHeight, faceWidth);
  },
  
  generateMouthShape1(faceContour: number[][], faceHeight: number, faceWidth: number) {
    return generateMouthShape1(faceContour, faceHeight, faceWidth);
  },
  
  generateMouthShape2(faceContour: number[][], faceHeight: number, faceWidth: number) {
    return generateMouthShape2(faceContour, faceHeight, faceWidth);
  }
};