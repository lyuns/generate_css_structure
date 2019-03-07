# 自动生成scss结构，简化前端开发
#### 便于直接编写css样式
#### 支持局部生成（推荐）

### 根据html自动生成scss结构，减少重复乏味的编写css结构流程，专注于更重要的部分。


## 示例成果
before:
``` bash
<div class="root">
    <div class="header">
        <img src="#" alt="">
    </div>
    <div class="content">
        <div class="breadcrumb">xxx -> xxx -> xxx</div>
        <div class="list">
            <a href="#" class="item">xxx</a>
            <a href="#" class="item">xxx</a>
            <a href="#" class="item">xxx</a>
            <a href="#" class="item">xxx</a>
        </div>
        <div class="pager">
            <div class="item">1</div>
            <div class="item">2</div>
            <div class="item">3</div>
        </div>
    </div>
    <div class="footer">
        <div class="copyright">xxx</div>
    </div>
</div>
```
after:
``` bash
.root {
  .header {
    img {
    }
  }
  .content {
    .breadcrumb {
    }
    .list {
      .item {
      }
    }
    .pager {
      .item {
      }
    }
  }
  .footer {
    .copyright {
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
