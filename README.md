# 自动生成scss结构，简化前端开发
*便于直接编写css样式*

*支持局部生成（推荐）*

*根据html自动生成scss结构，减少重复乏味的编写css结构流程，专注于更重要的部分。*

*多个class默认使用第一个class，其他class作为追加*

*无class时使用标签*

*欢迎各位前端开发使用*

<a href="http://zhaoyunpeng.com/workshop/gen">查看在线生成</a>


### 示例成果
before:
``` bash
<div class="root">
    <div class="header">
        <img src="#" alt="">
    </div>
    <div class="content">
        <div class="breadcrumb">xxx -> xxx -> xxx</div>
        <div class="side">
            <div class="list">
                <a href="#" class="item">xxx</a>
                <a href="#" class="item">xxx</a>
                <a href="#" class="item">xxx</a>
                <a href="#" class="item">xxx</a>
            </div>
        </div>
        <div class="main">
            <div class="form">
                <div class="form-group">
                    <input type="text">
                </div>
                <div class="form-group">
                    <button>XXX</button>
                </div>
            </div>
        </div>
        <div class="pager">
            <div class="item disabled">上一页</div>
            <div class="item active">1</div>
            <div class="item">2</div>
            <div class="item">3</div>
            <div class="item">下一页</div>
        </div>
    </div>
    <div class="footer">
        <div class="copyright">
            <span class="bold">XXX</span>
            <span>xxx</span>
        </div>
    </div>
</div>
```
after:
``` bash
.header {
  img {
  }
}
.content {
  .breadcrumb {
  }
  .side {
    .list {
      .item {
      }
    }
  }
  .main {
    .form {
      .form-group {
        input {
        }
        button {
        }
      }
    }
  }
  .pager {
    .item {
      &.disabled {
      }
      &.active {
      }
    }
  }
}
.footer {
  .copyright {
    .bold {
    }
    span {
    }
  }
}

```

* <a href="https://github.com/lyuns/generate_css_structure/tree/master/dist/result.scss">可能会是你想要的scss结构！</a>

运行方式:

``` bash
$ npm install
$ npm run start
```

配置文件：

配置项 | 说明
:---: | ---
*src* | 源html文件 
*dist* | 生成目标目录
*filename* | 目标文件名（*.scss 或 *.less） 
*selector* | 根选择器（类似于jquery）

## License

[MIT](http://opensource.org/licenses/MIT)
