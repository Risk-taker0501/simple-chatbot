import React, { Component } from "react";
import TreeNode from "../tree-node";
import AddButton from "../add-button";
import ControlPanel from "../control-panel";
import TextView from "../text-view";
import "./tree.css";
import DialogFlowContext from "../../DialogFlowContext";

class Tree extends Component {
  static contextType = DialogFlowContext;
  constructor(props) {
    super(props);
    this.state = {
      nodes: this.initializedСopy(this.props.data),
      savedNodes: []
    };
    this.changeTitle = this.changeTitle.bind(this);
    this.changeTitle1 = this.changeTitle1.bind(this);
    this.addRootElement = this.addRootElement.bind(this);
    this.addChild = this.addChild.bind(this);
    this.removeNode = this.removeNode.bind(this);
    this.saveState = this.saveState.bind(this);
    this.loadState = this.loadState.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.nodesToString = this.nodesToString.bind(this);
  }

  initializedСopy(nodes, location) {
    const nodesCopy = [];
    for (let i = 0; i < nodes.length; i++) {
      const { children, title, title1 } = nodes[i];
      const hasChildren = children !== undefined;
      const id = location ? `${location}.${i + 1}` : `${i + 1}`;
      nodesCopy[i] = {
        children: hasChildren ? this.initializedСopy(children, id) : undefined,
        changeTitle: this.changeTitle(id),
        changeTitle1: this.changeTitle1(id),
        removeNode: this.removeNode(id),
        addChild: this.addChild(id),
        id,
        title,
        title1
      };
    }
    return nodesCopy;
  }

  changeTitle(id) {
    return newTitle => {
      id = id.split(".").map(str => parseInt(str));
      const nodes = this.initializedСopy(this.state.nodes);
      let changingNode = nodes[id[0] - 1];

      if (id.length > 1) {
        for (let i = 1; i < id.length; i++) {
          changingNode = changingNode.children[id[i] - 1];
        }
      }

      changingNode.title = newTitle;
      this.setState({ nodes });
    };
  }

  changeTitle1(id) {
    return newTitle => {
      id = id.split(".").map(str => parseInt(str));
      const nodes = this.initializedСopy(this.state.nodes);
      let changingNode = nodes[id[0] - 1];

      if (id.length > 1) {
        for (let i = 1; i < id.length; i++) {
          changingNode = changingNode.children[id[i] - 1];
        }
      }

      changingNode.title1 = newTitle;
      this.setState({ nodes });
    };
  }

  addRootElement() {
    const id = this.state.nodes.length ? `${this.state.nodes.length + 1}` : "1";
    const newNode = {
      children: undefined,
      changeTitle: this.changeTitle(id),
      changeTitle1: this.changeTitle1(id),
      removeNode: this.removeNode(id),
      addChild: this.addChild(id),
      id,
      title: "",
      title1: ""
    };
    const nodes = [...this.state.nodes, newNode];
    this.setState({ nodes });
  }

  addChild(id) {
    return () => {
      id = id.split(".").map(str => parseInt(str));
      const nodes = this.initializedСopy(this.state.nodes);
      let changingNode = nodes[id[0] - 1];

      if (id.length > 1) {
        for (let i = 1; i < id.length; i++) {
          changingNode = changingNode.children[id[i] - 1];
        }
      }

      if (changingNode.children === undefined) {
        changingNode.children = [];
      }

      id = `${id.join(".")}.${changingNode.children.length + 1}`;

      changingNode.children = [
        ...changingNode.children,
        {
          children: undefined,
          changeTitle: this.changeTitle(id),
          changeTitle1: this.changeTitle1(id),
          removeNode: this.removeNode(id),
          addChild: this.addChild(id),
          id,
          title: "",
          title1: ""
        }
      ];

      this.setState({ nodes });
    };
  }

  removeNode(id) {
    return () => {
      id = id.split(".").map(str => parseInt(str));
      const nodes = this.initializedСopy(this.state.nodes);

      if (id.length === 1) {
        const newNodes = [
          ...nodes.slice(0, [id[0] - 1]),
          ...nodes.slice(id[0])
        ];

        this.setState({ nodes: this.initializedСopy(newNodes) });
      } else {
        let changingNode = nodes[id[0] - 1];

        for (let i = 2; i < id.length; i++) {
          changingNode = changingNode.children[id[i - 1] - 1];
        }

        const index = id[id.length - 1] - 1;

        const newChildren = [
          ...changingNode.children.slice(0, index),
          ...changingNode.children.slice(index + 1)
        ];
        changingNode.children = newChildren;

        this.setState({ nodes: this.initializedСopy(nodes) });
      }
    };
  }

  saveState() {
    function convertToSteps(data, parentId = "") {
      let steps = [];
      data.forEach((item, index) => {
        const step = {
          id: parentId ? `${parentId}_${index}` : `${index}`,
          message: item.title,
          trigger: item.children
            ? `${
                parentId
                  ? `${parentId}_${index}_before_option`
                  : `${index}_before_option`
              }`
            : "end"
        };
        steps.push(step);

        if (item.children) {
          const stepbefore = {
            id: parentId
              ? `${parentId}_${index}_before_option`
              : `${index}_before_option`,
            message: item.title1,
            trigger:
              item.children.length > 1
                ? `${
                    parentId ? `${parentId}_${index}_option` : `${index}_option`
                  }`
                : parentId
                ? `${parentId}_${index}`
                : `0_${index}`
          };
          steps.push(stepbefore);
          if (item.children.length > 1) {
            let options = [];
            item.children.forEach((child, num) => {
              const option = {
                value: num,
                label: child.title,
                trigger: `${
                  parentId ? (child.children? `${parentId}_${index}_${num}_before_option`:`${parentId}_${index}_${num}`) : `${index}_${num}`
                }`
              };
              options.push(option);
            });
            const option_step = {
              id: parentId ? `${parentId}_${index}_option` : `${index}_option`,
              options: options
            };
            steps.push(option_step);
          } else if(parentId) {
            const stepbefore = {
              id: parentId ? `${parentId}_${index}` : `${index}`,
              message: item.title,
              trigger: item.children
                ? `${
                    parentId ? `${parentId}_${index}_option` : `${index}_option`
                  }`
                : "end"
            };
            steps.push(stepbefore);
          }
        }

        if (item.children) {
          const convertedChildren = convertToSteps(item.children, step.id);
          steps = steps.concat(convertedChildren);
        }
      });
      return steps;
    }
    this.setState({ savedNodes: this.initializedСopy(this.state.nodes) });
    this.context.setJsonData(
      convertToSteps(this.initializedСopy(this.state.nodes))
    );
    console.log("raw data", this.initializedСopy(this.state.nodes));
    console.log(convertToSteps(this.initializedСopy(this.state.nodes)));
  }

  loadState() {
    this.setState({ nodes: this.initializedСopy(this.state.savedNodes) });
  }

  onTextChange(e) {
    this.setState({ nodes: this.initializedСopy(JSON.parse(e.target.value)) });
  }

  nodesToString() {
    return JSON.stringify(this.simplify(this.state.nodes), undefined, 2);
  }

  simplify(nodes) {
    const nodesCopy = [];
    for (let i = 0; i < nodes.length; i++) {
      const { children, title, title1 } = nodes[i];
      const hasChildren = children !== undefined && children.length > 0;
      nodesCopy[i] = {
        title,
        title1,
        children: hasChildren ? this.simplify(children) : undefined
      };
    }
    return nodesCopy;
  }

  render() {
    const { nodes, savedNodes } = this.state;
    const {
      addRootElement,
      saveState,
      loadState,
      onTextChange,
      nodesToString
    } = this;
    const hasSaved = savedNodes.length !== 0;

    return (
      <div className="Tree">
        <div className="Tree-LeftSide">
          <ControlPanel {...{ hasSaved, saveState, loadState }} />
          <ul className="Nodes">
            {nodes.map(nodeProps => {
              const { id, ...others } = nodeProps;
              return <TreeNode key={id} {...others} />;
            })}
          </ul>
          <AddButton onClick={addRootElement} />
        </div>

        <div className="Tree-RightSide">
          <TextView value={nodesToString()} onChange={onTextChange} />
        </div>
      </div>
    );
  }
}

export default Tree;
