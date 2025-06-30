

class AVLTreeNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
  }

  insert(key, value) {
    this.root = this.insertNode(this.root, key, value);
  }

  insertNode(node, key, value) {
    if (node === null) {
      return new AVLTreeNode(key, value);
    }

    if (key < node.key) {
      node.left = this.insertNode(node.left, key, value);
    } else if (key > node.key) {
      node.right = this.insertNode(node.right, key, value);
    } else {
      node.value = value;
      return node;
    }

    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));

    const balanceFactor = this.getBalanceFactor(node);

    if (balanceFactor > 1 && key < node.left.key) {
      return this.rotateRight(node);
    }

    if (balanceFactor < -1 && key > node.right.key) {
      return this.rotateLeft(node);
    }

    if (balanceFactor > 1 && key > node.left.key) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }

    if (balanceFactor < -1 && key < node.right.key) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }

  rotateLeft(z) {
    const y = z.right;
    const T2 = y.left;

    y.left = z;
    z.right = T2;

    z.height = 1 + Math.max(this.getHeight(z.left), this.getHeight(z.right));
    y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));

    return y;
  }

  rotateRight(z) {
    const y = z.left;
    const T3 = y.right;

    y.right = z;
    z.left = T3;

    z.height = 1 + Math.max(this.getHeight(z.left), this.getHeight(z.right));
    y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));

    return y;
  }

  getHeight(node) {
    if (node === null) {
      return 0;
    }

    return node.height;
  }

  getBalanceFactor(node) {
    if (node === null) {
      return 0;
    }

    return this.getHeight(node.left) - this.getHeight(node.right);
  }

  search(key) {
    return this.searchNode(this.root, key);
  }

  searchNode(node, key) {
    if (node === null) {
      return null;
    }

    if (key === node.key) {
      return node.value;
    }

    if (key < node.key) {
      return this.searchNode(node.left, key);
    }

    return this.searchNode(node.right, key);
  }

  remove(key) {
    this.root = this.removeNode(this.root, key);
  }

  removeNode(node, key) {
    if (node === null) {
      return null;
    }

    if (key < node.key) {
      node.left = this.removeNode(node.left, key);
    } else if (key > node.key) {
      node.right = this.removeNode(node.right, key);
    } else {
      if (node.left === null && node.right === null) {
        return null;
      }

      if (node.left === null) {
        return node.right;
      }

      if (node.right === null) {
        return node.left;
      }

      const minNode = this.getMinNode(node.right);
      node.key = minNode.key;
      node.value = minNode.value;
      node.right = this.removeNode(node.right, minNode.key);
    }

    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));

    const balanceFactor = this.getBalanceFactor(node);

    if (balanceFactor > 1 && this.getBalanceFactor(node.left) >= 0) {
      return this.rotateRight(node);
    }

    if (balanceFactor < -1 && this.getBalanceFactor(node.right) <= 0) {
      return this.rotateLeft(node);
    }

    if (balanceFactor > 1 && this.getBalanceFactor(node.left) < 0) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }

    if (balanceFactor < -1 && this.getBalanceFactor(node.right) > 0) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }

  getMinNode(node) {
    let current = node;

    while (current.left !== null) {
      current = current.left;
    }

    return current;
  }
}

const avlTree = new AVLTree();

function addWord() {
  const wordInput = document.getElementById('wordInput');
  const meaningInput = document.getElementById('meaningInput');
  const word = wordInput.value.trim();
  const meaning = meaningInput.value.trim();

  if (word === '' || meaning === '') {
    return;
  }

  avlTree.insert(word, meaning);
  animateNodeInsert(word);
  wordInput.value = '';
  meaningInput.value = '';
}

function searchWord() {
  const searchInput = document.getElementById('searchInput');
  const word = searchInput.value.trim();

  if (word === '') {
    return;
  }

  const meaning = avlTree.search(word);

  if (meaning !== null) {
    alert(`Word: ${word}\nMeaning: ${meaning}`);
  } else {
    alert(`Word '${word}' not found.`);
  }

  searchInput.value = '';
}

function removeWord() {
  const removeInput = document.getElementById('removeInput');
  const word = removeInput.value.trim();

  if (word === '') {
    return;
  }

  avlTree.remove(word);
  animateNodeRemove(word);
  removeInput.value = '';
}

function animateNodeInsert(key) {
  const avlTreeElement = document.getElementById('avlTree');
  const newNode = document.createElement('div');
  newNode.classList.add('node');
  newNode.textContent = key;
  newNode.style.animation = 'nodeInsertAnimation 1s';
  avlTreeElement.appendChild(newNode);

  // Remove the animation after it finishes
  newNode.addEventListener('animationend', () => {
    newNode.style.animation = '';
  });
}

function animateNodeRemove(key) {
  const avlTreeElement = document.getElementById('avlTree');
  const nodes = avlTreeElement.getElementsByClassName('node');

  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].textContent === key) {
      nodes[i].style.animation = 'nodeRemoveAnimation 1s';

      // Remove the node after the animation finishes
      nodes[i].addEventListener('animationend', () => {
        avlTreeElement.removeChild(nodes[i]);
      });

      break;
    }
  }
}
