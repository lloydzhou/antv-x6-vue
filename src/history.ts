// @ts-nocheck

export default class HistoryManager {
  protected actions = []
  protected current = 0

  // 使用一个列表加上一个指针来处理
  // 列表中存放{commit, rollback}两个函数。undo的时候调用rollback，redo的时候调用commit
  // 添加操作的时候，使用splice将redo的列表删除，同时在后面增加当前的操作
  constructor() {
    this.actions = []
    this.current = -1
  }
  push(commit, rollback) {
    return Promise.resolve().then(() => {
      return commit()
    }).then(res => {
      console.log('push res', res, 'current', this.current, 'redoSize', this.redoSize, 'length', this.length)
      this.actions.splice(++this.current, this.redoSize + 1, { commit, rollback })
    })
  }
  get length() {
    return this.actions.length
  }
  get redoSize() {
    return this.length - this.current - 1
  }
  get undoSize() {
    return this.current + 1
  }
  get canRedo() {
    return this.redoSize > 0
  }
  get canUndo() {
    return this.undoSize > 0
  }
  redo() {
    return Promise.resolve(this.canRedo).then(canRedo => {
      if (canRedo) {
        const { commit } = this.actions[this.current + 1]
        console.log('commit', this.current, commit)
        if (typeof commit == "function") {
          return commit()
        }
      }
      throw new Error()
    }).then(res => {
      console.log('redo res', res)
      this.current += 1
    })
  }
  undo() {
    return Promise.resolve(this.canUndo).then(canUndo => {
      if (canUndo) {
        const { rollback } = this.actions[this.current]
        console.log('rollback', this.current, rollback)
        if (typeof rollback == "function") {
          return rollback()
        }
      }
      throw new Error()
    }).then(res => {
      console.log('undo res', res)
      this.current -= 1
    })
  }
}

async function test() {
  const h = new HistoryManager()

  let inc = 0
  // 0 --> 2
  await h.push(() => inc = 2, () => inc = 0)
  // 2 --> 3
  await h.push(() => inc += 1, () => inc -= 1)

  console.log('HistoryManager', h, inc)
  console.log(this)
  // 3 --> 2
  await h.undo()
  console.log('undo', h.redoSize, h.undoSize, inc, 'inc = 2')
  // 2 --> 0
  await h.undo()
  console.log('undo', h.redoSize, h.undoSize, inc, 'inc = 0')
  // 0 --> 2
  await h.redo()
  console.log('redo', h.redoSize, h.undoSize, inc, 'inc = 2')
  // 2 --> 3
  await h.redo()
  console.log('redo', h.redoSize, h.undoSize, inc, 'inc = 3')
  // 报错
  await h.redo().catch(console.log)
  console.log('redo', h.redoSize, h.undoSize, inc, 'inc = 3')
  // 3 --> 2
  await h.undo()
  console.log('undo', h.redoSize, h.undoSize, inc, 'inc = 2')
  // 2 --> 4
  await h.push(() => inc += 2, () => inc -= 2)
  console.log('push', h.redoSize, h.undoSize, inc, 'inc = 4', h)
  // 4 --> 2
  await h.undo()
  console.log('undo', h.redoSize, h.undoSize, inc, 'inc = 2')
  // 2 --> 0
  await h.undo()
  console.log('undo', h.redoSize, h.undoSize, inc, 'inc = 0')
  // 0 --> 4
  await h.push(() => inc += 4, () => inc -= 4)
  console.log('push', h.redoSize, h.undoSize, inc, 'inc = 4', h)
}


