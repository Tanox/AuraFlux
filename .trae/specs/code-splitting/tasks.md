# Aura Flux - 代码拆分实现计划

## [x] 任务1：创建渲染模式目录结构
- **优先级**：P0
- **依赖**：无
- **描述**：
  - 在`src/components/visualizers`目录下创建`modes`目录
  - 用于存放不同可视化模式的渲染逻辑
- **验收标准**：AC-1, AC-4
- **测试要求**：
  - `programmatic` TR-1.1：目录结构创建成功
  - `human-judgment` TR-1.2：目录命名清晰合理
- **备注**：按照模式类型组织文件，每个模式一个文件

## [x] 任务2：拆分BARS模式渲染逻辑
- **优先级**：P0
- **依赖**：任务1
- **描述**：
  - 创建`src/components/visualizers/modes/BarsMode.ts`
  - 将BARS模式的渲染逻辑从VisualizerCanvas.tsx中移到该文件
  - 导出渲染函数
- **验收标准**：AC-2, AC-4
- **测试要求**：
  - `programmatic` TR-2.1：文件创建成功，代码逻辑正确
  - `human-judgment` TR-2.2：代码风格一致，命名清晰
- **备注**：保持原有逻辑不变，只进行代码移动

## [x] 任务3：拆分WAVEFORM模式渲染逻辑
- **优先级**：P0
- **依赖**：任务1
- **描述**：
  - 创建`src/components/visualizers/modes/WaveformMode.ts`
  - 将WAVEFORM模式的渲染逻辑从VisualizerCanvas.tsx中移到该文件
  - 导出渲染函数
- **验收标准**：AC-2, AC-4
- **测试要求**：
  - `programmatic` TR-3.1：文件创建成功，代码逻辑正确
  - `human-judgment` TR-3.2：代码风格一致，命名清晰
- **备注**：保持原有逻辑不变，只进行代码移动

## [x] 任务4：拆分RINGS模式渲染逻辑
- **优先级**：P0
- **依赖**：任务1
- **描述**：
  - 创建`src/components/visualizers/modes/RingsMode.ts`
  - 将RINGS模式的渲染逻辑从VisualizerCanvas.tsx中移到该文件
  - 导出渲染函数
- **验收标准**：AC-2, AC-4
- **测试要求**：
  - `programmatic` TR-4.1：文件创建成功，代码逻辑正确
  - `human-judgment` TR-4.2：代码风格一致，命名清晰
- **备注**：保持原有逻辑不变，只进行代码移动

## [x] 任务5：拆分PLASMA模式渲染逻辑
- **优先级**：P0
- **依赖**：任务1
- **描述**：
  - 创建`src/components/visualizers/modes/PlasmaMode.ts`
  - 将PLASMA模式的渲染逻辑从VisualizerCanvas.tsx中移到该文件
  - 导出渲染函数
- **验收标准**：AC-2, AC-4
- **测试要求**：
  - `programmatic` TR-5.1：文件创建成功，代码逻辑正确
  - `human-judgment` TR-5.2：代码风格一致，命名清晰
- **备注**：保持原有逻辑不变，只进行代码移动

## [x] 任务6：拆分NEBULA模式渲染逻辑
- **优先级**：P0
- **依赖**：任务1
- **描述**：
  - 创建`src/components/visualizers/modes/NebulaMode.ts`
  - 将NEBULA模式的渲染逻辑从VisualizerCanvas.tsx中移到该文件
  - 导出渲染函数
- **验收标准**：AC-2, AC-4
- **测试要求**：
  - `programmatic` TR-6.1：文件创建成功，代码逻辑正确
  - `human-judgment` TR-6.2：代码风格一致，命名清晰
- **备注**：保持原有逻辑不变，只进行代码移动

## [x] 任务7：拆分TUNNEL模式渲染逻辑
- **优先级**：P0
- **依赖**：任务1
- **描述**：
  - 创建`src/components/visualizers/modes/TunnelMode.ts`
  - 将TUNNEL模式的渲染逻辑从VisualizerCanvas.tsx中移到该文件
  - 导出渲染函数
- **验收标准**：AC-2, AC-4
- **测试要求**：
  - `programmatic` TR-7.1：文件创建成功，代码逻辑正确
  - `human-judgment` TR-7.2：代码风格一致，命名清晰
- **备注**：保持原有逻辑不变，只进行代码移动

## [x] 任务8：拆分FLUID_CURVES模式渲染逻辑
- **优先级**：P0
- **依赖**：任务1
- **描述**：
  - 创建`src/components/visualizers/modes/FluidCurvesMode.ts`
  - 将FLUID_CURVES模式的渲染逻辑从VisualizerCanvas.tsx中移到该文件
  - 导出渲染函数
- **验收标准**：AC-2, AC-4
- **测试要求**：
  - `programmatic` TR-8.1：文件创建成功，代码逻辑正确
  - `human-judgment` TR-8.2：代码风格一致，命名清晰
- **备注**：保持原有逻辑不变，只进行代码移动

## [x] 任务9：拆分PARTICLES模式渲染逻辑
- **优先级**：P0
- **依赖**：任务1
- **描述**：
  - 创建`src/components/visualizers/modes/ParticlesMode.ts`
  - 将PARTICLES模式的渲染逻辑从VisualizerCanvas.tsx中移到该文件
  - 导出渲染函数
- **验收标准**：AC-2, AC-4
- **测试要求**：
  - `programmatic` TR-9.1：文件创建成功，代码逻辑正确
  - `human-judgment` TR-9.2：代码风格一致，命名清晰
- **备注**：保持原有逻辑不变，只进行代码移动

## [x] 任务10：更新VisualizerCanvas.tsx文件
- **优先级**：P0
- **依赖**：任务2-9
- **描述**：
  - 导入所有拆分后的渲染函数
  - 修改主组件，使用这些函数替代内联逻辑
  - 确保文件长度不超过200行
- **验收标准**：AC-2, AC-3, AC-4
- **测试要求**：
  - `programmatic` TR-10.1：文件更新成功，长度不超过200行
  - `human-judgment` TR-10.2：代码结构清晰，逻辑正确
  - `human-judgment` TR-10.3：所有可视化模式正常工作
- **备注**：保持组件的API接口不变