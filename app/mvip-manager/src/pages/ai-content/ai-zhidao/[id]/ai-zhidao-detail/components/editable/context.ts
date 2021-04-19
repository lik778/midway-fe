import React, { useContext, useState, useEffect, useRef } from 'react';

import { FormInstance } from 'antd/lib/form';

export const EditableContext = React.createContext<FormInstance<any> | null>(null)

