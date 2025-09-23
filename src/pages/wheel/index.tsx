import { View, Text, Canvas, Input, Button } from '@tarojs/components'
import { useState, useEffect, useRef } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'

interface Option {
  id: string;
  text: string;
  color: string;
}

const WheelPage = () => {
  const [options, setOptions] = useState<Option[]>([
    { id: '1', text: '选项1', color: '#FF6384' },
    { id: '2', text: '选项2', color: '#36A2EB' },
    { id: '3', text: '选项3', color: '#FFCE56' },
    { id: '4', text: '选项4', color: '#4BC0C0' },
  ]);
  const [newOption, setNewOption] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [angle, setAngle] = useState(0);
  const canvasRef = useRef<any>(null);
  const canvasContext = useRef<any>(null);
  const animationId = useRef<number | null>(null);
  const targetAngle = useRef(0);
  const currentSpeed = useRef(0);

  // 颜色列表
  const colorList = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
    '#9966FF', '#FF9F40', '#8AC249', '#EA526F',
    '#25CCF7', '#FD7272', '#54A0FF', '#1DD1A1'
  ];

  // 初始化Canvas - 简化版本
  useEffect(() => {
    console.log('初始化Canvas组件');
    
    // 使用Taro官方推荐的方式获取Canvas上下文
    const ctx = Taro.createCanvasContext('wheelCanvas', this);
    canvasContext.current = ctx;
    
    // 延迟绘制确保组件已挂载
    setTimeout(() => {
      console.log('开始绘制转盘');
      drawWheel();
    }, 500);
  }, []);

  // 当选项变化时重绘转盘
  useEffect(() => {
    if (canvasContext.current) {
      drawWheel();
    }
  }, [options]);

  // 绘制转盘 - 水平展示版本
  const drawWheel = () => {
    if (!canvasContext.current) {
      console.error('Canvas上下文未初始化');
      return;
    }
    
    const ctx = canvasContext.current;
    // 使用固定尺寸
    const width = 300;
    const height = 150;
    const centerX = height / 2; // 交换中心点计算方式
    const centerY = height / 2;
    const radius = centerY - 10; // 使用高度作为直径的参考
    
    console.log('开始绘制水平转盘，选项数量:', options.length);
    
    // 清除画布
    ctx.clearRect(0, 0, width, height);
    
    // 绘制转盘背景
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.setFillStyle('#f5f5f5');
    ctx.fill();
    
    // 绘制转盘
    if (options.length > 0) {
      const sliceAngle = (2 * Math.PI) / options.length;
      
      options.forEach((option, index) => {
        // 计算扇形角度 - 水平方向的角度计算
        const startAngle = index * sliceAngle + angle - Math.PI / 2; // 从右侧开始(-90度)
        const endAngle = (index + 1) * sliceAngle + angle - Math.PI / 2;
        
        // 绘制扇形
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.lineTo(centerX, centerY);
        ctx.setFillStyle(option.color);
        ctx.fill();
        
        // 绘制文字 - 水平方向的文字位置
        const textAngle = startAngle + sliceAngle / 2;
        const textX = centerX + Math.cos(textAngle) * (radius * 0.6);
        const textY = centerY + Math.sin(textAngle) * (radius * 0.6);
        ctx.setFillStyle('#FFFFFF');
        ctx.setTextAlign('center');
        ctx.setFontSize(14);
        ctx.fillText(option.text, textX, textY);
      });
      
      // 绘制中心点
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.1, 0, 2 * Math.PI);
      ctx.setFillStyle('#FFFFFF');
      ctx.fill();
      ctx.setStrokeStyle('#000000');
      ctx.setLineWidth(2);
      ctx.stroke();
      
      // 绘制指针 - 水平方向的指针(指向右侧)
      ctx.beginPath();
      ctx.moveTo(centerX + radius + 10, centerY);
      ctx.lineTo(centerX + radius - 10, centerY - 10);
      ctx.lineTo(centerX + radius - 10, centerY + 10);
      ctx.closePath();
      ctx.setFillStyle('#FF0000');
      ctx.fill();
    } else {
      // 如果没有选项，显示提示
      ctx.setFillStyle('#CCCCCC');
      ctx.setFontSize(16);
      ctx.setTextAlign('center');
      ctx.fillText('请添加选项', centerX, centerY);
    }
    
    // 提交绘制
    ctx.draw();
    console.log('转盘绘制完成');
  };

  // 添加选项
  const addOption = () => {
    if (newOption.trim() === '') return;
    
    const newId = String(Date.now());
    const colorIndex = options.length % colorList.length;
    
    setOptions([...options, {
      id: newId,
      text: newOption,
      color: colorList[colorIndex]
    }]);
    setNewOption('');
  };

  // 删除选项
  const removeOption = (id: string) => {
    setOptions(options.filter(option => option.id !== id));
  };

  // 随机排序选项
  const shuffleOptions = () => {
    const shuffled = [...options].sort(() => Math.random() - 0.5);
    setOptions(shuffled);
  };

  // 开始旋转
  const spinWheel = () => {
    if (isSpinning || options.length < 2) return;
    
    setIsSpinning(true);
    setResult(null);
    
    // 随机目标角度 (5-10圈 + 随机偏移)
    const spinCount = 5 + Math.random() * 5;
    targetAngle.current = angle + (Math.PI * 2 * spinCount);
    currentSpeed.current = 0.3;
    
    // 开始动画
    if (animationId.current !== null) {
      cancelAnimationFrame(animationId.current);
    }
    animateWheel();
  };

  // 转盘动画
  const animateWheel = () => {
    // 更新角度
    setAngle(prevAngle => {
      let newAngle = prevAngle + currentSpeed.current;
      
      // 减速效果
      if (newAngle >= targetAngle.current - Math.PI) {
        currentSpeed.current *= 0.98;
      }
      
      // 检查是否停止
      if (currentSpeed.current < 0.002) {
        // 动画结束
        setIsSpinning(false);
        
        // 计算结果
        const normalizedAngle = newAngle % (Math.PI * 2);
        const sliceAngle = (Math.PI * 2) / options.length;
        const resultIndex = Math.floor(options.length - (normalizedAngle / sliceAngle) % options.length);
        const finalIndex = resultIndex % options.length;
        
        setResult(options[finalIndex].text);
        return newAngle;
      }
      
      // 继续动画
      animationId.current = requestAnimationFrame(animateWheel);
      return newAngle;
    });
    
    // 重绘转盘 - 确保在角度更新后立即重绘
    setTimeout(() => drawWheel(), 0);
  };

  return (
    <View className='wheel-container'>
      <View className='wheel-header'>
        <Text className='wheel-title'>幸运转盘</Text>
        <Text className='wheel-subtitle'>让决策变得简单有趣</Text>
      </View>
      
      <View className='wheel-canvas-container'>
        <Canvas
          type='2d'
          id='wheelCanvas'
          className='wheel-canvas'
          onTouchStart={spinWheel}
        />
        {result && (
          <View className='wheel-result'>
            <Text className='wheel-result-text'>结果: {result}</Text>
          </View>
        )}
      </View>
      
      <View className='wheel-controls'>
        <Button 
          className='wheel-button primary' 
          onClick={spinWheel}
          disabled={isSpinning || options.length < 2}
        >
          {isSpinning ? '旋转中...' : '开始旋转'}
        </Button>
        <Button className='wheel-button secondary' onClick={shuffleOptions}>
          随机排序
        </Button>
      </View>
      
      <View className='wheel-options'>
        <View className='wheel-options-header'>
          <Text className='wheel-options-title'>选项列表</Text>
        </View>
        
        <View className='wheel-options-list'>
          {options.map(option => (
            <View key={option.id} className='wheel-option-item'>
              <View 
                className='wheel-option-color' 
                style={{ backgroundColor: option.color }}
              />
              <Text className='wheel-option-text'>{option.text}</Text>
              <Text 
                className='wheel-option-delete' 
                onClick={() => removeOption(option.id)}
              >
                ×
              </Text>
            </View>
          ))}
        </View>
        
        <View className='wheel-options-add'>
          <Input
            className='wheel-options-input'
            value={newOption}
            onInput={e => setNewOption(e.detail.value)}
            placeholder='输入新选项'
            maxlength={20}
          />
          <Button 
            className='wheel-button small' 
            onClick={addOption}
          >
            添加
          </Button>
        </View>
      </View>
      
      <View className='wheel-footer'>
        <Text className='wheel-footer-text'>© 2023 幸运转盘小程序</Text>
      </View>
    </View>
  );
};

export default WheelPage;