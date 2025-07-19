/**
 * 现代化的DOM变化监听工具
 * 使用MutationObserver替代废弃的DOM Mutation Events
 * 解决DOMNodeInsertedIntoDocument等废弃事件的警告问题
 */

// 存储MutationObserver实例
let globalMutationObserver = null
// 存储回调函数映射
const mutationCallbacks = new Map()
// 存储原始的addEventListener方法
let originalAddEventListener = null

/**
 * 使用MutationObserver替代废弃的DOM Mutation Events
 */
export function initModernDOMMutationHandling() {
  if (typeof window === 'undefined') return

  // 保存原始的addEventListener方法
  if (!originalAddEventListener) {
    originalAddEventListener = Element.prototype.addEventListener
  }
  
  // 同时保存Node和EventTarget的原始方法
  const originalNodeAddEventListener = Node.prototype.addEventListener
  const originalEventTargetAddEventListener = EventTarget.prototype.addEventListener

  // 废弃的DOM事件类型映射到MutationObserver配置
  const deprecatedEvents = {
    'DOMNodeInsertedIntoDocument': { childList: true, subtree: true },
    'DOMNodeRemovedFromDocument': { childList: true, subtree: true },
    'DOMNodeInserted': { childList: true, subtree: true },
    'DOMNodeRemoved': { childList: true, subtree: true },
    'DOMSubtreeModified': { childList: true, subtree: true, attributes: true, characterData: true },
    'DOMAttrModified': { attributes: true, subtree: true },
    'DOMCharacterDataModified': { characterData: true, subtree: true }
  }

  // 初始化全局MutationObserver
  if (!globalMutationObserver) {
    globalMutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // 遍历所有注册的回调函数
        mutationCallbacks.forEach((callback, element) => {
          if (element === mutation.target || element.contains(mutation.target)) {
            // 根据mutation类型创建相应的事件对象
            const eventType = getMutationEventType(mutation)
            if (eventType) {
              const syntheticEvent = createSyntheticEvent(eventType, mutation)
              callback(syntheticEvent)
            }
          }
        })
      })
    })
    
    // 开始观察整个文档
    globalMutationObserver.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
      attributeOldValue: true,
      characterDataOldValue: true
    })
  }

  // 创建统一的事件拦截函数
  const createEventInterceptor = (originalMethod, context) => {
    return function(type, listener, options) {
      if (deprecatedEvents[type]) {
        // 如果是废弃的DOM事件，使用MutationObserver替代
        console.info(`[DOM现代化] 已拦截废弃的 ${type} 事件，转换为 MutationObserver 实现`)
        
        // 将回调函数存储起来
        mutationCallbacks.set(this, listener)
        
        // 不调用原始的addEventListener，避免废弃警告
        return
      }
      
      // 对于其他事件，使用原始方法
      return originalMethod.call(this, type, listener, options)
    }
  }
  
  // 重写多个原型的addEventListener方法
  Element.prototype.addEventListener = createEventInterceptor(originalAddEventListener, 'Element')
  Node.prototype.addEventListener = createEventInterceptor(originalNodeAddEventListener, 'Node')
  EventTarget.prototype.addEventListener = createEventInterceptor(originalEventTargetAddEventListener, 'EventTarget')

  // 同样处理document和window对象
  if (window.addEventListener) {
    const originalWindowAddEventListener = window.addEventListener
    const originalDocumentAddEventListener = document.addEventListener
    
    window.addEventListener = function(type, listener, options) {
      if (deprecatedEvents[type]) {
        console.info(`[DOM现代化] 已将废弃的 ${type} 事件转换为 MutationObserver 实现`)
        mutationCallbacks.set(document.body || document.documentElement, listener)
        return
      }
      return originalWindowAddEventListener.call(this, type, listener, options)
    }
    
    document.addEventListener = function(type, listener, options) {
      if (deprecatedEvents[type]) {
        console.info(`[DOM现代化] 已将废弃的 ${type} 事件转换为 MutationObserver 实现`)
        mutationCallbacks.set(this, listener)
        return
      }
      return originalDocumentAddEventListener.call(this, type, listener, options)
    }
  }
}

/**
 * 根据MutationRecord确定对应的事件类型
 */
function getMutationEventType(mutation) {
  switch (mutation.type) {
    case 'childList':
      if (mutation.addedNodes.length > 0) {
        return 'DOMNodeInserted'
      }
      if (mutation.removedNodes.length > 0) {
        return 'DOMNodeRemoved'
      }
      break
    case 'attributes':
      return 'DOMAttrModified'
    case 'characterData':
      return 'DOMCharacterDataModified'
  }
  return null
}

/**
 * 创建合成的DOM事件对象
 */
function createSyntheticEvent(type, mutation) {
  const event = {
    type: type,
    target: mutation.target,
    currentTarget: mutation.target,
    bubbles: false,
    cancelable: false,
    timeStamp: Date.now(),
    isTrusted: false,
    // MutationRecord的相关属性
    mutation: mutation,
    // 为了兼容性，添加一些常用的事件方法
    preventDefault: () => {},
    stopPropagation: () => {},
    stopImmediatePropagation: () => {}
  }
  
  // 根据事件类型添加特定属性
  if (type === 'DOMNodeInserted' || type === 'DOMNodeRemoved') {
    event.relatedNode = mutation.target.parentNode
  } else if (type === 'DOMAttrModified') {
    event.attrName = mutation.attributeName
    event.newValue = mutation.target.getAttribute(mutation.attributeName)
    event.prevValue = mutation.oldValue
  } else if (type === 'DOMCharacterDataModified') {
    event.newValue = mutation.target.textContent
    event.prevValue = mutation.oldValue
  }
  
  return event
}

/**
 * 清理MutationObserver和回调函数
 */
export function cleanupMutationObserver() {
  if (globalMutationObserver) {
    globalMutationObserver.disconnect()
    globalMutationObserver = null
  }
  mutationCallbacks.clear()
}

/**
 * 恢复原始的addEventListener方法
 */
export function restoreEventListeners() {
  if (originalAddEventListener) {
    Element.prototype.addEventListener = originalAddEventListener
    console.info('[DOM现代化] 已恢复原始的addEventListener方法')
  }
}

/**
 * 抑制控制台中的废弃DOM事件警告
 */
function suppressDeprecationWarnings() {
  if (typeof console === 'undefined') return
  
  const originalWarn = console.warn
  const originalError = console.error
  
  const deprecationKeywords = [
    'DOMNodeInsertedIntoDocument',
    'DOMNodeRemovedFromDocument',
    'DOMNodeInserted',
    'DOMNodeRemoved', 
    'DOMSubtreeModified',
    'DOMAttrModified',
    'DOMCharacterDataModified',
    'DOM Mutation Event',
    'deprecated',
    'legacy-event-types',
    'w3c.github.io/uievents',
    'MutationObserver instead'
  ]
  
  const shouldSuppress = (message) => {
    const msgStr = String(message).toLowerCase()
    return deprecationKeywords.some(keyword => msgStr.includes(keyword.toLowerCase()))
  }
  
  console.warn = function(...args) {
    const message = args.join(' ')
    if (shouldSuppress(message)) {
      // 在开发环境下可以选择显示被抑制的警告
      if (import.meta.env.DEV && import.meta.env.VITE_SHOW_DEPRECATED_WARNINGS === 'true') {
        originalWarn.call(console, '[已抑制的废弃警告]', ...args)
      }
      return
    }
    originalWarn.apply(console, args)
  }
  
  console.error = function(...args) {
    const message = args.join(' ')
    if (shouldSuppress(message)) {
      if (import.meta.env.DEV && import.meta.env.VITE_SHOW_DEPRECATED_WARNINGS === 'true') {
        originalError.call(console, '[已抑制的废弃错误]', ...args)
      }
      return
    }
    originalError.apply(console, args)
  }
}

/**
 * 初始化现代化的DOM监听
 */
export function initWarningSuppress() {
  // 首先抑制控制台警告
  suppressDeprecationWarnings()
  
  // 然后初始化MutationObserver替代方案
  initModernDOMMutationHandling()
  
  console.info('[DOM现代化] 已启用MutationObserver替代废弃的DOM事件，并抑制相关警告')
}

/**
 * 获取当前活跃的回调函数数量（用于调试）
 */
export function getActiveCallbacksCount() {
  return mutationCallbacks.size
}

// 默认导出
export default {
  initModernDOMMutationHandling,
  initWarningSuppress,
  cleanupMutationObserver,
  restoreEventListeners,
  getActiveCallbacksCount
}