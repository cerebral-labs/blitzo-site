// 定义窗口的位置类型
export interface Position {
  x: number;
  y: number;
}

export type Entrance = "desktop" | "dock";

// 定义桌面应用的类型
export interface IApp {
  id: number;
  name: string;
  icon?: string;
  route: React.ComponentType | string; // 应用对应的组件
  entrance?: Entrance | Entrance[]; // 启动入口
}

// 定义窗口的类型
export interface IWindow extends IApp {
  isMaximized?: boolean;
  position?: Position;
}

// 定义快应用的类型
export interface IQkApp {
  id: string; // 快应用的唯一标识
  name: string;
  icon?: string; // 快应用的图标
  allPageStacks: string[]; // 快应用支持的所有页面栈
  sharedData?: any; // 共享数据
}

// 定义正在运行的快应用状态类型
export interface ActiveQkApp {
  appId: string; // 快应用 ID
  name: string; // 快应用名称
  pageStack: string[]; // 当前运行的页面栈
  sharedData?: any; // 共享数据
}

// 定义应用状态类型
export interface appState {
  windows: IWindow[]; // 当前运行的窗口列表
  installedApps: IApp[]; // 已安装的桌面应用列表
  qkApps?: IQkApp[]; // 快应用列表
  activeQkApp?: ActiveQkApp | null; // 当前运行的快应用状态
}

declare global {
  interface Window {
    showMessage: (message:string,options?:any)=> void;
  }
}

// 临时类型声明：放宽对 swiper React 组件与模块的类型检查，避免构建报错
declare module "swiper/react" {
  export const Swiper: any;
  export const SwiperSlide: any;
}

declare module "swiper/modules" {
  export const EffectCards: any;
  export const Pagination: any;
}